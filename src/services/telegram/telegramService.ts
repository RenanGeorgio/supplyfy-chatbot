import TelegramBot from "node-telegram-bot-api";
import { processQuestion } from "../../libs/trainModel";
import { askEmail } from "./helpers/askEmail";
import { botExist } from "../../repositories/bot";
import { createClient } from "../../repositories/client";
import { chatOriginExist, createChat } from "../../repositories/chat";
import { ignoredMessages } from "./helpers/ignoredMessages";
import { crmSocketClient } from "../../core/http";
import { createMessage } from "../../repositories/message";

const telegramService = async (token: string) => {
  const telegram = new TelegramBot(token, { polling: true });

  try {
    await telegram.getMe();
  } catch (error) {
    return telegram.stopPolling();
  }

  let clientId: string | null = null;
  let enableChatBot = false;

  telegram.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const { first_name, last_name } = msg.chat;

    const checkIfClientOriginExist = await chatOriginExist({
      platform: "telegram",
      chatId: chatId.toString(),
    });

    if (checkIfClientOriginExist) {
      await telegram.sendMessage(chatId, `Olá, ${first_name}!`);
      enableChatBot = true;
    } else {
      await telegram.sendMessage(
        msg.chat.id,
        `Olá, seja bem-vindo! \n\nPara começar, por favor, informe seu e-mail.`
      );

      const { clientEmailEventEmitter } = await askEmail(telegram, msg);

      const createClientEvent = async (email: string) => {
        const client = await createClient(email, first_name!, last_name || " ");
        clientId = client?._id.toString()!;
        await telegram.sendMessage(chatId, `Olá, ${first_name}!`);
        
      };

      clientEmailEventEmitter.once("telegramClientEmail", (email) =>
        createClientEvent(email)
      );
      enableChatBot = true;
    }

    telegram.onText(/\/suporte/, async (msg) => {
      await telegram.sendMessage(chatId, `Aguarde um momento, por favor!`);
      telegram.removeListener("message", messageHandler);
      telegram.removeTextListener(/\/suporte/);

      const bot = await botExist("services.telegram.token", token);
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

          crmSocketClient.emit("newClientChat", chatRepo);
          crmSocketClient.emit("addNewUser", clientId);

          crmSocketClient.on("disconnect", () => {
            crmSocketClient.disconnect();
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
              crmSocketClient.emit("sendMessage", newMessage);
            }
          });

          crmSocketClient.on("getMessage", (msg) => {
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
      console.log("enableChatBot: ", enableChatBot);
      if (from?.is_bot === false) {
        const answer = await processQuestion(text ?? "");
        telegram.sendMessage(chat.id, answer);
      }
    }
  };

  telegram.on("message", messageHandler);

  const botName = (await telegram.getMe()).username;
  console.info(`Telegram bot - ${botName} is running...`);

  return telegram;
};

export default telegramService;
