import { Request, Response } from "express";
import messageModel from "../../models/chat/messageModel";
import chatSessionModel from "../../models/chat/chatSession";
import { createChatSession } from "../../repositories/chatSession";
import { createChat, findChatById } from "../../repositories/chat";
import Queue from "../../libs/Queue";
import { botExist } from "../../repositories/bot";
import { ITelegramCredentials } from "../../types";
import { servicesActions } from "../../services";
import {
  clientChatExist,
  createChatClient,
} from "../../repositories/chatClient";
import { IClientInfo, IMessage } from "../../types/types";
import { createMessage } from "../../repositories/message";

export const create = async (req: Request, res: Response) => {
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
    res.status(500).json(error.message);
  }
};

export const list = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    return res.status(201).json(messages);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

// export const createSession = async (req: Request, res: Response) => {
//   const { url, token } = req.body;

//   try {

//     const verifyToken = true;

//     if(!verifyToken){
//       return res.status(401).json({ message: "Token inválido" });
//     }

//     const session = createChatSession({
//       companyId: "1", //mock
//       url,
//       token,
//       expiresDate: new Date(),
//     });

//     return res.status(201).json(session);
//   } catch (error: any) {
//     res.status(500).json(error.message);
//   }

// }

export const sendMessage = async (req: Request, res: Response) => {
  const {
    message,
    clientInfo,
  }: {
    message: IMessage;
    clientInfo: IClientInfo;
  } = req.body; // conteudo da mensagem, conteudo do cliente
  const companyId = "1";
  let client: any;
  let chat: any;

  try {
    chat = await findChatById(message.chatId);
    // to-do: verificar se o chat não foi encerrado

    const bot = await botExist("companyId", companyId);

    if (!bot) {
      return res.status(404).json({ message: "Bot não encontrado" });
    }

    if (!chat && message.service !== "telegram") {
      if (!clientInfo?.username || !clientInfo?.name) {
        return res
          .status(400)
          .json({ message: "Cliente não existe e os dados não foram informados" });
      }

      client = await clientChatExist(clientInfo.username);

      if (!client) {
        client = await createChatClient(
          clientInfo.username,
          clientInfo.name,
          clientInfo?.lastName || " "
        );
      }
      // criar chat aqui ?
      chat = await createChat({
        members: [client?._id, message.senderId],
        origin: {
          platform: message.service,
          chatId: "",
        },
      });
    } else {
      if (chat?.origin.platform === "telegram") {
        //telegram
        const credentials = bot.services?.telegram as ITelegramCredentials;
        // const serviceControl = servicesActions[credentials._id];
        // verificar
        await createMessage(message.senderId, chat._id, message.text);

        Queue.add(
          "TelegramService",
          { id: chat.origin.chatId, message: message.text },
          credentials._id
        );

        return res.status(201).json({ message: "Mensagem enviada" });
      }
      else {
        return res.status(400).json({ message: "Chat não encontrado" });
      }
    }
  } catch (error: any) {
    console.log(error);
  }
};
