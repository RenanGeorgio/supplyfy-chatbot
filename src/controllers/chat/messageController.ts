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
} from "../../repositories/chatClient";
import {
  CustomRequest,
  IChat,
  IClientInfo,
  IEmailCredentials,
  IMessage,
} from "../../types/types";
import { createMessage } from "../../repositories/message";
import { findWebhook } from "../../repositories/webhook";
import { userExist } from "../../repositories/user";
import { findBot } from "../../helpers/findBot";
import { Platforms } from "../../types/enums";
import { whatsappCloudApi } from "../../api";
import { sendMsg } from "../com/service";

const ServiceList = {
  telegram: "telegramServices",
  email: "emailServices",
  whatsapp: "whatsappServices",
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
    console.log(message);
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

    // for (const service in Platforms) {
    let index = 0;
    // if (Platforms[service] === message.service) {
    index++;
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

    const chat = await findChatById(message.chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat não encontrado" });
    }

    if (chat && (chat as IChat).status !== "active") {
      return res.status(400).json({ message: "Chat não está ativo" });
    }

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
        to: message.recipientId as string,
        type: "text",
        text: {
          preview_url: true,
          body: message.text,
        },
      };
      const send = await sendMsg(
        data,
        whatsappCloudApi("v20.0", credentials.numberId as string)
      );
      console.log(send);
    }
    // whatsappCloudApi("v20.0", chat.origin.chatId);

    // Queue.add(
    //   ServiceList[message.service], // ex: TelegramService,
    //   {
    //     id: chat?.origin?.chatId,
    //     message: createdMessage,
    //     webhookUrl: webhook.url,
    //   },
    //   credentials._id
    // );

    return res.status(201).json();

    // } else {
    //   return res.status(400).json({ message: "Serviço não encontrado" });
    // }
    // }

    // return res.status(400).json({ message: "Serviço não encontrado" });
    //
    // if (message.service === Platforms.EMAIL) {
    //   const credentials = bot.services?.email as IEmailCredentials;
    //   const serviceControl = servicesActions[message.service];

    //   if (!serviceControl) {
    //     return res.status(404).json({ message: "Serviço não encontrado" });
    //   }

    //   const emailService = findBot(
    //     credentials._id.toString(),
    //     serviceControl.emailServices
    //   );

    //   if (!emailService) {
    //     return res.status(400).json({ message: "Serviço não está rodando" });
    //   }

    //   Queue.add("EmailService", {
    //     from: credentials.emailUsername,
    //     to: message.recipientId,
    //     subject: message.subject,
    //     text: message.text,
    //     service: {
    //       type: "email",
    //       id: credentials._id?.toString(),
    //     },
    //     webhookUrl: webhook.url,
    //   });

    //   return res.status(201).json();
    // }

    // if (message.service === Platforms.WHATSAPP) {
    //   // whatsapp
    //   const credentials = bot.services?.whatsapp as any;
    //   const serviceControl = servicesActions[credentials._id];
    //   // verificar
    //   const createdMessage = await createMessage(
    //     user._id.toString(),
    //     chat._id,
    //     message.text
    //   );

    //   if ("success" in createdMessage) {
    //     return res.status(400).json({ message: createdMessage.message });
    //   }

    //   // vou adicionar o webhook aqui, para enviar confirmação de mensagem enviada
    //   Queue.add(
    //     "WhatsappService",
    //     {
    //       id: chat.origin.chatId,
    //       message: createdMessage,
    //       webhookUrl: webhook.url,
    //     },
    //     credentials._id
    //   );

    //   return res.status(201).json();
    // }

    // if (
    //   !chat &&
    //   message.service !== Platforms.TELEGRAM &&
    //   message.service !== Platforms.EMAIL
    // ) {
    //   if (!clientInfo?.username || !clientInfo?.name) {
    //     return res.status(400).json({
    //       message: "Cliente não existe e os dados não foram informados",
    //     });
    //   }

    //   client = await clientChatExist(clientInfo.username, user.companyId);

    //   if (!client) {
    //     client = await createChatClient(
    //       clientInfo.username,
    //       clientInfo.name,
    //       clientInfo?.lastName || "",
    //       user.companyId
    //     );
    //   }
    //   // criar chat aqui ?
    //   chat = await createChat({
    //     members: [client?._id, user._id],
    //     origin: {
    //       platform: message.service,
    //       chatId: "",
    //     },
    //   });
    // } else {
    // if (message.service === "telegram") {
    //   //telegram
    //   const credentials = bot.services?.telegram as ITelegramCredentials;
    //   // const serviceControl = servicesActions[credentials._id];
    //   // verificar
    //   const createdMessage = await createMessage(
    //     user._id.toString(),
    //     chat._id,
    //     message.text
    //   );

    //   if ("success" in createdMessage) {
    //     return res.status(400).json({ message: createdMessage.message });
    //   }

    //   // vou adicionar o webhook aqui, para enviar confirmação de mensagem enviada
    //   Queue.add(
    //     "TelegramService",
    //     {
    //       id: chat.origin.chatId,
    //       message: createdMessage,
    //       webhookUrl: webhook.url,
    //     },
    //     credentials._id
    //   );

    //   return res.status(201).json();
    // } else if(message.service === "whatsapp") {

    // }

    // else {
    //   return res.status(400).json({ message: "Chat não encontrado" });
    // }
    // }
  } catch (error: any) {
    next(error);
  }
};
