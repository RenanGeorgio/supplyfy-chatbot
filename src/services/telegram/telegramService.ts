import TelegramBot from "node-telegram-bot-api";
// import { processQuestion } from "../../libs/bot/nlp/manager";
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
import { enqueue } from "../enqueue";
import { sendTelegramText } from "./processMessage";
import { emitMessageToCompany } from "../socket/socketMessage";
import { SocketEvents } from "../../websocket/enum";

const sendMessage = async (
  bot: TelegramBot,
  id: TelegramBot.ChatId,
  txt: string,
  options?: TelegramBot.SendMessageOptions,
  kafka?: any
) => {
  await bot.sendMessage(id, txt, options);
  if (kafka) {
    await produceMessage({
      text: txt ?? "",
      to: id.toString(),
      ...kafka,
    });
  }
};

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

  const kafkaMessage = {
    topic: bot?.companyId,
    service: "telegram",
  };

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
  const botId = (await telegram.getMe()).id;

  async function messageHandler(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const client = clients.get(chatId);
    await produceMessage({
      text: msg.text ?? "",
      from: chatId.toString(),
      to: botId.toString(),
      ...kafkaMessage,
    });

    if (!client) {
      clients.set(chatId, {
        flow: ClientFlow.CHABOT,
        clientId: null,
        chatId: null,
      });
      const greetingsText = `Olá, ${msg.chat.first_name}!`;
      await sendMessage(telegram, chatId, greetingsText, undefined, {
        ...kafkaMessage,
        from: botId.toString(),
      });
      await sendMessage(
        telegram,
        msg.chat.id,
        "Você está sendo atendido por um bot",
        undefined,
        { ...kafkaMessage, from: botId.toString() }
      );
    }

    if (
      msg.text === "/suporte" &&
      clients.get(chatId).flow === ClientFlow.CHABOT
    ) {
      // adiciona chat na fila de atendimento
      enqueue({
        params: {
          id: chatId.toString(),
          message: { text: msg.text },
        },
        data: {
          eventData: {
            CallSid: chatId.toString(),
            Caller: msg.chat.first_name,
            From: chatId.toString(),
            To: botId.toString(),
            queuePosition: "1", // posição na fila
            QueueSid: "1", // ida na fila
            queueTime: new Date().toString(),
            avgQueueTime: "0", // tempo medio na fila
            currentQueueSize: "1", // tamanho atual da fila
            maxQueueSize: "100",
          },
          filterCompanyId: bot!.companyId,
        },
      });

      const { first_name, last_name } = msg.chat;
      clients.get(chatId).flow = ClientFlow.EMAIL;
      const { clientEmailEventEmitter } = await askEmail(telegram, msg);

      const createClientEvent = async (email: string) => {
        const checkClient = await clientChatExist(email, bot!.companyId);
        if (!checkClient) {
          const newClient = await createChatClient(
            email,
            first_name!,
            last_name!,
            bot!.companyId
          );
          clients.get(chatId).clientId = newClient?._id.toString()!;
        } else {
          clients.get(chatId).clientId = checkClient._id.toString()!;
        }
        clients.get(chatId).flow = ClientFlow.HUMAN;
        await sendMessage(
          telegram,
          chatId,
          "Aguardando atendimento humano",
          undefined,
          { ...kafkaMessage, from: botId.toString() }
        );
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

            socket.emit(SocketEvents.NEW_CLIENT_CHAT, chatRepo);
            socket.emit(SocketEvents.ADD_NEW_USER, {
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
      // const responseMessage = await processQuestion(msg.text as string);
      const responseMessage = sendTelegramText({
        senderChatId: client.chatId,
        senderId: client.clientId,
        text: msg.text as string,
        origin: {
          chatId: String(chatId),
        },
        credentials: {
          _id: credentials._id,
        },
      }); // TO-DO: incluir no fluxo do bot

      // if (responseMessage === "Desculpe, não tenho uma resposta para isso.") {
      //   await sendMessage(telegram, chatId, responseMessage, undefined, {
      //     ...kafkaMessage,
      //     from: botId.toString(),
      //   });
      //   return await sendMessage(
      //     telegram,
      //     chatId,
      //     "Deseja falar com um atendente?",
      //     {
      //       reply_markup: {
      //         keyboard: [[{ text: "/suporte" }]],
      //         resize_keyboard: true,
      //       },
      //     },
      //     {
      //       ...kafkaMessage,
      //       from: botId.toString(),
      //     }
      //   );
      // }

      // await sendMessage(telegram, chatId, responseMessage, undefined, {
      //   ...kafkaMessage,
      //   from: botId.toString(),
      // });
    } else if (client && client.flow === ClientFlow.HUMAN) {
      const recipientId = bot?.companyId;

      if (msg.text === "/sair") {
        await sendMessage(telegram, chatId, "Suporte finalizado", undefined, {
          ...kafkaMessage,
          from: botId.toString(),
        });

        const message = await createMessage(
          client.clientId,
          client.chatId,
          "Atendimento finalizado!"
        );

        // socket.emit("sendMessage", { ...message, recipientId });
        if ("success" in message && !message.success) {
          if (bot?.companyId) {
            emitMessageToCompany(socket, {
              ...message,
              recipientId: bot.companyId,
              senderId: client.clientId,
              text: msg.text as string,
              chatId: client.chatId,
              service: "telegram",
            });
          }
        }

        socket.emit(SocketEvents.DISCONNECT_CLIENT, client.clientId);
        clients.get(chatId).flow = ClientFlow.CHABOT;

        const chat = await updateChatStatus(client.chatId, {
          status: "finished",
        });

        if ("success" in chat && !chat.success) {
          return;
        }

        if (webhook && "members" in chat) {
          webhookTrigger({
            url: webhook.url,
            event: Events.CHAT_ENDED,
            message: {
              chatId: client.chatId,
              members: chat.members,
              createdAt: chat.createdAt,
              updatedAt: chat.updatedAt,
            },
            service: "telegram",
          });
        }

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

      // socket.emit("sendMessage", newMessage);
      emitMessageToCompany(socket, newMessage);
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

  socket.on(SocketEvents.GET_MESSAGE, async (message: IMessage) => {
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

  console.log(`📘 Telegram: serviço iniciado \x1b[4m${botName}\x1b[0m`);
  return telegram;
};

export default telegramService;
