import TelegramBot from "node-telegram-bot-api";
import Message from "../../models/chat/message";
import { processQuestion } from "../../helpers/trainModel";
import ClientModel from "../../models/chat/client";
import { validateEmail } from "../../helpers/validateEmail";
import { askEmail } from "./helpers/askEmail";
import ChatModel from "../../models/chat/chat";
import { clientExist } from "../db/client";
import { botExist } from "../db/bot";
import ChatService from "../chat";
import { io } from "../..";

const telegramService = async (token: string) => {
  const telegram = new TelegramBot(token, { polling: true });
  let clientId: string | null = null;

  telegram.onText(/\/start/, async (msg) => {
    await telegram.sendMessage(
      msg.chat.id,
      `Olá, seja bem-vindo! \n\nPara começar, por favor, informe seu e-mail.`
    );

    const { clientEmailEventEmitter } = await askEmail(telegram, msg);
    clientEmailEventEmitter.on("telegramClientEmail", async (email: string) => {
      let client = await clientExist(email);
      
      if (!client) {
        client = await ClientModel.create({
          name: msg.chat.first_name,
          lastName: msg.chat?.last_name || " ",
          email,
        });
      }

      clientId = client?._id.toString()!;
      await telegram.sendMessage(msg.chat.id, `Olá, ${msg.chat.first_name}!`);
    });

    telegram.onText(/\/suporte/, async (msg) => {
      telegram.removeListener("message", async (msg) => {});

      await telegram.sendMessage(msg.chat.id, `Aguarde um momento, por favor!`);
      telegram.removeTextListener(/\/suporte/);

      const bot = await botExist(token);

      await ChatModel.create({
        members: [clientId, bot?.companyId],
        origin: {
          platform: "telegram",
          chatId: msg.chat.id,
        }
      });

      // ChatService()
      
      // io.emit("addNewUser", clientId);
      // telegram.on("message", async (msg) => {
      //   // io.emit("message", {});
      //   console.log("message", msg);
      // });

      console.log("suporte");
    });
  });

  telegram.on("message", async (msg) => {
    const { chat, text, date, from } = msg;

    if (from?.is_bot === false) {
      const answer = await processQuestion(text ?? "");
      telegram.sendMessage(chat.id, answer);
    }
  });

  const botName = (await telegram.getMe()).username;
  console.info(`Telegram bot - ${botName} is running...`);

  return telegram;
};

export default telegramService;
