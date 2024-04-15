import TelegramBot from "node-telegram-bot-api";
import { processQuestion } from "../../libs/trainModel";
import { askEmail } from "./helpers/askEmail";
import { botExist } from "../../repositories/bot";
import { clientChatExist, createChatClient } from "../../repositories/chatClient";
import { chatOriginExist, createChat } from "../../repositories/chat";
import { ignoredMessages } from "./helpers/ignoredMessages";
import { createMessage } from "../../repositories/message";
import { webhookTrigger } from "../webhook/webhookTrigger";
import { Events, IBotData } from "../../types/types";
import { servicesActions } from "..";
import { findBot } from "../../helpers/findBot";

const telegramService = async (token: string, webhook: any) => {
  const telegram = new TelegramBot(token, { polling: true });

  try {
    await telegram.getMe();
  } catch (error) {
    return telegram.stopPolling();
  }

  const bot = await botExist("services.telegram.token", token);

  const socketInfo = bot?.socket as IBotData["socket"];

  const { socket } = findBot(
    socketInfo._id.toString(),
    servicesActions.socket.sockets
  )!;

  let clientId: string | null = null;
  let enableChatBot = false;

  telegram.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const { first_name, last_name } = msg.chat;

    await telegram.sendMessage(
      msg.chat.id,
      `Olá, seja bem-vindo! \n\nPara começar, por favor, informe seu e-mail.`
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

      await telegram.sendMessage(chatId, `Olá, ${first_name}!`);
      enableChatBot = true;
    };

    clientEmailEventEmitter.once("telegramClientEmail", (email) =>
      createClientEvent(email)
    );

    telegram.onText(/\/suporte/, async (msg) => {
      await telegram.sendMessage(chatId, `Aguarde um momento, por favor!`);
      telegram.removeListener("message", messageHandler);
      telegram.removeTextListener(/\/suporte/);
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
              socket.emit("sendMessage", newMessage);
            }
          });

          socket.on("getMessage", (msg) => {
            telegram.sendMessage(chatId, msg.text);
          });
        }
      }
    });
  });

  const messageHandler = async (msg: TelegramBot.Message) => {
    const { chat, text, date, from } = msg;
    if (text) {
      console.log("Message received: ", text);
      if (!enableChatBot || ignoredMessages(text)) return;
      if (from?.is_bot === false) {
        const answer = await processQuestion(text ?? "");
        telegram.sendMessage(chat.id, answer);
      }
    }
  };

  telegram.on("message", messageHandler);

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
  console.info(`Telegram bot - ${botName} is running...`);

  return telegram;
};

export default telegramService;