import TelegramBot from "node-telegram-bot-api";
import { processQuestion } from "../../helpers/trainModel";
import ClientModel from "../../models/chat/client";
import { validateEmail } from "../../helpers/validateEmail";
import { askEmail } from "./helpers/askEmail";
import { botExist } from "../../repositories/bot";
import ChatService from "../chat";
import { io } from "../..";
import { createClient } from "../../repositories/client";
import { createChat } from "../../repositories/chat";
import { ignoredMessages } from "./helpers/ignoredMessages";

const telegramService = async (token: string) => {
  const telegram = new TelegramBot(token, { polling: true });
  let clientId: string | null = null;
  let enableChatBot = false;

  telegram.onText(/\/start/, async (msg) => {
    await telegram.sendMessage(
      msg.chat.id,
      `Olá, seja bem-vindo! \n\nPara começar, por favor, informe seu e-mail.`
    );

    const name = msg.chat.first_name!;
    const lastName = msg.chat?.last_name || " ";
    const chatId = msg.chat.id;

    const { clientEmailEventEmitter } = await askEmail(telegram, msg);

    const createClientEvent = async (email: string) => {
      const client = await createClient(email, name, lastName);
      clientId = client?._id.toString()!;
      await telegram.sendMessage(msg.chat.id, `Olá, ${name}!`);
      enableChatBot = true;
    };

    clientEmailEventEmitter.once("telegramClientEmail", (email) =>
      createClientEvent(email)
    );

    telegram.onText(/\/suporte/, async (msg) => {
      await telegram.sendMessage(msg.chat.id, `Aguarde um momento, por favor!`);
      telegram.removeListener("message", messageHandler);
      telegram.removeTextListener(/\/suporte/);

      const bot = await botExist("services.telegram.token", token);
      enableChatBot = false;

      if (bot) {
        const { companyId } = bot!;

        if (clientId && companyId && chatId) {
          await createChat({
            members: [clientId, bot?.companyId],
            origin: {
              platform: "telegram",
              chatId: chatId.toString(),
            },
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
