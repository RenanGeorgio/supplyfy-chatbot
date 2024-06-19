import TelegramBot from "node-telegram-bot-api";
import { processQuestion } from "../../libs/trainModel";
import { askEmail } from "./helpers/askEmail";
import { botExist } from "../../repositories/bot";
import {
  clientChatExist,
  createChatClient,
} from "../../repositories/chatClient";
import {
  createChat,
  findChatById,
  updateChatStatus,
} from "../../repositories/chat";
import { ignoredMessages } from "./helpers/ignoredMessages";
import { createMessage } from "../../repositories/message";
import { webhookTrigger } from "../../webhooks/custom/webhookTrigger";
import { IMessage, ITelegramCredentials, IWebhook } from "../../types/types";
import Queue from "../../libs/Queue";
import { produceMessage } from "../../core/kafka/producer";
import { socketServiceController } from "../socket";
import { ClientFlow, Events } from "../../types/enums";

const telegramService = async (
  credentials: ITelegramCredentials,
  webhook: IWebhook | undefined
) => {
  const token = credentials.token;
  const telegram = new TelegramBot(token, { polling: true });
  const clients = new Map();
  // São armezados no Map, o flow atual, o chatId e o clientId
  // Existem 3 fluxos atualmente: CHABOT, EMAIL e HUMAN
  try {
    await telegram.getMe();
  } catch (error) {
    return telegram.stopPolling();
  }

  const bot = await botExist("services.telegram.token", token);

  if (!bot) {
    return;
  }

  const socket = socketServiceController.start({
    _id: bot.companyId,
    url: "https://chatbot.ignai.com.br", // adicionar env depois, pra faciliar a troca em desenvolvimento
    // url: "http://localhost:8000",
    auth: {
      token: "1234567890",
    },
  });

  if (!socket) {
    return;
  }

  const botName = (await telegram.getMe()).username;

  async function messageHandler(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const client = clients.get(chatId);

    if (!client) {
      clients.set(chatId, {
        flow: ClientFlow.CHABOT,
        clientId: null,
        chatId: null,
      });
      const greetingsText = `Olá, ${msg.chat.first_name}!`;
      await telegram.sendMessage(chatId, greetingsText);
      telegram.sendMessage(msg.chat.id, "Você está sendo atendido por um bot");
    }

    if (
      msg.text === "/suporte" &&
      clients.get(chatId).flow === ClientFlow.CHABOT
    ) {
      const { first_name, last_name } = msg.chat;
      clients.get(chatId).flow = ClientFlow.EMAIL;
      const { clientEmailEventEmitter } = await askEmail(telegram, msg);

      const createClientEvent = async (email: string) => {
        const checkClient = await clientChatExist(email);
        if (!checkClient) {
          const newClient = await createChatClient(
            email,
            first_name!,
            last_name || " "
          );
          clients.get(chatId).clientId = newClient?._id.toString()!;
        } else {
          clients.get(chatId).clientId = checkClient._id.toString()!;
        }
        clients.get(chatId).flow = ClientFlow.HUMAN;
        telegram.sendMessage(chatId, "Aguardando atendimento humano");
      };

      clientEmailEventEmitter.once("telegramClientEmail", async (email) => {
        await createClientEvent(email);
        if (bot) {
          const { companyId } = bot!;
          if (clients.get(chatId) && companyId && chatId) {
            const clientId = clients.get(chatId).clientId;
            // cria ou retorna um chat existente
            const chatRepo = await createChat({
              members: [clientId, bot?.companyId],
              origin: {
                platform: "telegram",
                chatId: chatId.toString(),
              },
            });

            socket.emit("newClientChat", chatRepo);
            socket.emit("addNewUser", {
              userId: clientId,
              platform: "telegram",
            });
            // evento é sempre disparado quando o usuário iniciar o /suporte, mesmo que já exista um chat cadastrado
            if (webhook && chatRepo) {
              const { members, _id, createdAt, updatedAt } = chatRepo;

              webhookTrigger({
                url: webhook.url,
                event: Events.CHAT_CREATED, // mudar para CHAT_UPDATED, caso o chat já exista(se necessário)
                message: {
                  members,
                  chatId: _id,
                  createdAt,
                  updatedAt,
                },
                service: "telegram",
              });

              clients.get(chatId).chatId = _id.toString();
            }
          }
        }
      });
    }

    if (
      client &&
      client.flow === ClientFlow.CHABOT &&
      !ignoredMessages(msg.text as string)
    ) {
      const responseMessage = await processQuestion(msg.text as string);
      telegram.sendMessage(chatId, responseMessage);
    } else if (client && client.flow === ClientFlow.HUMAN) {
      const recipientId = bot?.companyId;

      if (msg.text === "/sair") {
        telegram.sendMessage(chatId, "Suporte finalizado");
        const message = await createMessage(
          client.clientId,
          client.chatId,
          "Atendimento finalizado!"
        );
        socket.emit("sendMessage", { ...message, recipientId });
        socket.emit("disconnectClient", client.clientId);
        clients.get(chatId).flow = ClientFlow.CHABOT;
        updateChatStatus(client.chatId, "finished");
        return;
      }

      const message = await createMessage(
        client.clientId,
        client.chatId,
        msg.text as string
      );

      const newMessage: any = { ...message, recipientId };

      if (webhook) {
        webhookTrigger({
          url: webhook.url,
          event: Events.MESSAGE_RECEIVED,
          message: newMessage,
          service: "telegram",
        });
      }

      socket.emit("sendMessage", newMessage);
    } else {
    }
  }

  telegram.on("message", messageHandler);

  telegram.on("polling_error", () => {
    if (webhook) {
      // webhookTrigger({
      //   url: webhook.url,
      //   event: Events.SERVICE_ERROR,
      //   message: "telegram bot polling error",
      //   service: "telegram",
      // });
      console.log(`📕 Telegram: bot ${botName} polling error`);
    }
  });

  socket.on("getMessage", async (message: IMessage) => {
    if (message?.chatId) {
      const chat = await findChatById(message.chatId);
      if (chat && "origin" in chat) {
        Queue.add(
          "TelegramService",
          { id: chat.origin?.chatId, message: { text: message.text } },
          credentials._id
        );
      }
      console.log(
        `📗 Telegram: \x1b[4m${botName}\x1b[0m received message from socket`
      );
    }
  });

  console.log(`📘 Telegram: \x1b[4m${botName}\x1b[0m started`);
  return telegram;
};

export default telegramService;
