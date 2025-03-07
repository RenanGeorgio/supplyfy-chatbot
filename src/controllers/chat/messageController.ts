import { NextFunction, Response } from "express";
import messageModel from "../../models/chat/messageModel";
import chatSessionModel from "../../models/chat/chatSession";
// import { createChatSession } from "../../repositories/chatSession";
import { createChat, findChatById } from "../../repositories/chat";
import Queue from "../../libs/Queue";
import { botExist } from "../../repositories/bot";
import { ITelegramCredentials, SendText } from "../../types";
import { servicesActions } from "../../services";
import {
  clientChatExist,
  createChatClient,
  findChatClientById,
} from "../../repositories/chatClient";
import {
  CustomRequest,
  IChat,
  IClientInfo,
  IEmailCredentials,
  IMessage,
} from "../../types/types";
import { createMessage, listChatMessages } from "../../repositories/message";
import { findWebhook } from "../../repositories/webhook";
import { userExist } from "../../repositories/user";
import { findBot } from "../../helpers/findBot";
import { Events, Platforms } from "../../types/enums";
import { whatsappCloudApi } from "../../api";
import { sendMsg } from "../com/service";
import WhatsappService from "../../services/whatsapp";
import { webhookTrigger } from "../../webhooks/custom/webhookTrigger";

const ServiceList = {
  telegram: "telegramServices",
  email: "emailServices",
  whatsapp: "whatsappServices",
};

const templateMessage = {
  messaging_product: "whatsapp",
  type: "template",
  template: {
    name: "hello_world",
    language: {
      code: "en_US",
    },
  },
};

export const create = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { chatId, senderId, text } = req.body;

  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });

    const savedMessage = await message.save();

    return res.status(201).json(savedMessage);
  } catch (error: any) {
    next(error);
  }
};

export const list = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    return res.status(200).json(messages);
  } catch (error: any) {
    next(error);
  }
};

export const sendMessage = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const {
    message,
  }: {
    message: IMessage;
  } = req.body; // conteudo da mensagem, conteudo do cliente
  try {
    
    if (!message.text || !message.service) {
      return res.status(400).json({ message: "Dados não informados" });
    }

    const user = await userExist(req.user?.sub as string);

    if (!user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const bot = await botExist("companyId", user?.companyId as string);

    if (!bot) {
      return res.status(404).json({ message: "Bot não encontrado" });
    }

    const webhook = await findWebhook({ companyId: user?.companyId as string });

    if (!webhook) {
      return res.status(404).json({ message: "Webhook não encontrado" });
    }

    if (!message.service) {
      return res.status(400).json({ message: "Serviço não informado" });
    }

    const credentials = bot.services?.[message.service] as any;

    const serviceControl = servicesActions[message.service];

    if (!serviceControl) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    const serviceList = serviceControl[ServiceList[message.service]];

    const service = findBot(credentials._id.toString(), serviceList);

    if (!service) {
      return res.status(400).json({ message: "Serviço não está rodando" });
    }

    if (message.service === Platforms.EMAIL) {
      if (!message.subject && message.recipientId) {
        return res
          .status(400)
          .send({ message: "Assunto ou destinatário não informado" });
      }

      Queue.add("EmailService", {
        from: credentials.emailUsername,
        to: message.recipientId,
        subject: message.subject,
        text: message.text,
        service: {
          type: "email",
          id: credentials._id?.toString(),
        },
        webhookUrl: webhook.url,
      });

      return res.status(201).json();
    }
    const client = await findChatClientById(message.recipientId as string)

    if (!client && "error") {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    const chat = await findChatById(message.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat não encontrado" });
    }

    if (chat && (chat as IChat).status !== "active") {
      return res.status(400).json({ message: "Chat não está ativo" });
    }
    
    // verificando se há messagens no chat
    const listMessages = await listChatMessages(message.chatId);
    const createdMessage = await createMessage(
      user._id.toString(),
      message.chatId,
      message.text
    );

    if ("success" in createdMessage) {
      return res.status(400).json({ message: createdMessage.message });
    }

    // vou adicionar o webhook aqui, para enviar confirmação de mensagem enviada

    if (message.service === Platforms.TELEGRAM) {
      Queue.add(
        "TelegramService",
        {
          id: chat?.origin?.chatId,
          message: createdMessage,
          webhookUrl: webhook.url,
        },
        credentials._id
      );
      return res.status(201).json();
    }

    if (message.service === Platforms.WHATSAPP) {

      const data: SendText = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: client?.username as string,
        type: "text",
        text: {
          preview_url: true,
          body: message.text,
        },
      };

      // const whatsappService = new WhatsappService({
      //   senderPhoneNumberId: bot.services?.whatsapp?.numberId,
      //   recipientPhoneNumberId: message.recipientId as string,
      //   accessToken: bot.services?.whatsapp?.accessToken
      // })

      const whatsappService = {
        senderPhoneNumberId: bot.services?.whatsapp?.numberId,
        recipientPhoneNumberId: client?.username as string,
        accessToken: bot.services?.whatsapp?.accessToken,
      };

      if (listMessages?.length === 0) {
        const send = await sendMsg({...templateMessage, to: client?.username as string}, whatsappService);
      } else {
        const send = await sendMsg(data, whatsappService);
      }

      const webhook = await findWebhook({ companyId: user?.companyId });

      if (webhook) {
        webhookTrigger({
          url: webhook?.url,
          event: Events.MESSAGE_SENT,
          message: message.text,
          service: "whatsapp",
        });
      }

      return res.status(201).json();
    }
  } catch (error: any) {
    next(error);
  }
};
