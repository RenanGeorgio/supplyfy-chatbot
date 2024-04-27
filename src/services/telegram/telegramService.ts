import TelegramBot from "node-telegram-bot-api";
import { processQuestion } from "../../libs/trainModel";
import { askEmail } from "./helpers/askEmail";
import { botExist } from "../../repositories/bot";
import {
  clientChatExist,
  createChatClient,
} from "../../repositories/chatClient";
import { chatOriginExist, createChat } from "../../repositories/chat";
import { ignoredMessages } from "./helpers/ignoredMessages";
import { createMessage } from "../../repositories/message";
import { webhookTrigger } from "../webhook/webhookTrigger";
import { Events, IBotData, ITelegramCredentials, ITelegramService, IWebhook } from "../../types/types";
import { servicesActions } from "..";
import { findBot } from "../../helpers/findBot";
import Queue from "../../libs/Queue";
import { produceMessage } from "../../core/kafka/producer";

const telegramService = async (credentials: ITelegramCredentials, webhook: IWebhook | undefined)  => {
  const token = credentials.token;
  const telegram = new TelegramBot(token, { polling: true }); // verficar depois
  let chatStarted = false; // testando

  try {
    await telegram.getMe();
  } catch (error) {
    return telegram.stopPolling();
  }

  const bot = await botExist("services.telegram.token", token);

  const kafkaMessage = {
    topic: bot?.companyId + ".messages",
    service: "telegram"
  }

  const socketInfo = bot?.socket as IBotData["socket"];
  
  const socketService = findBot(
    socketInfo._id.toString(),
    servicesActions.socket.sockets
  )!;

  const socket = socketService?.socket;

  let clientId: string | null = null;
  let enableChatBot = false;
  const botId = (await telegram.getMe()).id

  const kafkaMessage = {
    topic: "diamond.messages",
    service: "telegram"
  }

  const botId = (await telegram.getMe()).id

  telegram.onText(/\/start/, async (msg) => {
    chatStarted = true;
    const chatId = msg.chat.id;
    const { first_name, last_name } = msg.chat;
    await produceMessage({ text: "/start", from: chatId.toString(), to: botId.toString(), ...kafkaMessage })

    const greetingsTextEmail = `Olá, seja bem-vindo! \n\nPara começar, por favor, informe seu e-mail.`
    await produceMessage({ text: greetingsTextEmail, from: botId.toString(), to: chatId.toString(), ...kafkaMessage })
    await telegram.sendMessage(
      msg.chat.id,
      greetingsTextEmail
    );

    const { clientEmailEventEmitter } = await askEmail(telegram, msg);

    const createClientEvent = async (email: string) => {
      const checkClient = await clientChatExist(email);

      if (!checkClient) {
        const newClient = await createChatClient(
          email,
          first_name!,
          last_name || " "
        );
        clientId = newClient?._id.toString()!;
      } else {
        clientId = checkClient?._id.toString()!;
      }
      const greetingsText = `Olá, ${first_name}!`

      await produceMessage({ text: greetingsText, from: botId.toString(), to: chatId.toString(), ...kafkaMessage })
      await telegram.sendMessage(chatId, greetingsText);
      enableChatBot = true;
    };

    clientEmailEventEmitter.once("telegramClientEmail", (email) =>
      createClientEvent(email)
    );

    telegram.on("message", messageHandler);

    telegram.onText(/\/suporte/, async (msg) => {
      await produceMessage({ text: "/suporte", from: chatId.toString(), to: botId.toString(), ...kafkaMessage });
      const waitText = `Aguarde um momento, por favor!`;
      await telegram.sendMessage(chatId, waitText);
      await produceMessage({ text: waitText, from: botId.toString(), to: chatId.toString(), ...kafkaMessage });

      //telegram.removeListener("message", messageHandler);
      telegram.removeTextListener(/\/suporte/);
      telegram.removeListener("message", messageHandler);
      enableChatBot = false;

      if (bot) {
        const { companyId } = bot!;
        if (clientId && companyId && chatId) {
          const chatRepo = await createChat({
            members: [clientId, bot?.companyId],
            origin: {
              platform: "telegram",
              chatId: chatId.toString(),
            },
          });

          socket.emit("newClientChat", chatRepo);
          socket.emit("addNewUser", clientId);

          socket.on("disconnect", () => {
            socket.disconnect();
          });

          telegram.on("message", async (msg) => {
            const { text, date, from } = msg;
            const recipientId = companyId;

            const message = await createMessage(
              clientId!,
              chatRepo._id.toString(),
              text!
            );

            const newMessage = { ...message, recipientId };

            if (newMessage) {
              await produceMessage({ text: newMessage.text ?? "", from: clientId ?? "", to: chatId.toString(), ...kafkaMessage })
              socket.emit("sendMessage", newMessage);
            }
          });

          socket.on("getMessage", async (msg) => {
            await produceMessage({ text: msg.text, from: chatId.toString(), to: clientId ?? "", ...kafkaMessage })
            Queue.add(
              "TelegramService",
              { id: chatId, message: msg.text },
              credentials._id
            );
          });
        }
      }
    });
  });

  const messageHandler = async (msg: TelegramBot.Message) => {
    const { chat, text, date, from } = msg;
    if (text) {
      if (!enableChatBot || ignoredMessages(text)) return;
      if (from?.is_bot === false) {
        await produceMessage({ text, from: chat.id.toString(), to: botId.toString(), ...kafkaMessage })
        const answer = await processQuestion(text ?? "");
        // await telegram.sendMessage(chat.id, answer);
        await produceMessage({ text: answer, from: botId.toString(), to: chat.id.toString(), ...kafkaMessage })
        //teste
        Queue.add(
          "TelegramService",
          { id: chat.id, message: answer },
          credentials._id
        );
      }
    }
  };

  telegram.on("polling_error", () => {
    if (webhook) {
      webhookTrigger({
        url: webhook.url,
        event: Events.SERVICE_ERROR,
        message: "telegram bot polling error",
        service: "telegram",
      });
    }
  });

  const botName = (await telegram.getMe()).username;
  console.info(`Telegram bot conectado: ${botName}`);

  return telegram;
};

export default telegramService;
