import TelegramBot from "node-telegram-bot-api";
import Message from "../../models/chat/Message";
import { processQuestion } from "../../helpers/trainModel";

const telegramService = async (token: string) => {
  const telegram = new TelegramBot(token, { polling: true });

  telegram.on("message", async (msg) => {
    const { chat, text, date, from } = msg;

    if (from?.is_bot === false) {
      const answer = await processQuestion(text ?? "");
      if (text === "/start") {
        const userChat = await Message.findOne({ chatId: chat.id });

        if (!userChat) {
          const newUserChat = new Message({
            name: chat.first_name + " " + chat.last_name,
            chatId: chat.id,
            message: text,
            answer: answer,
            date: date,
          });
          await newUserChat.save();
        }
      } else {
        const newUserChat = new Message({
          name: chat.first_name + " " + chat.last_name,
          chatId: chat.id,
          message: text,
          answer: answer,
          date: date,
        });
        await newUserChat.save();
      }

      telegram.sendMessage(chat.id, answer);
    }
  });

  const botName = (await telegram.getMe()).username;
  console.info(`Telegram bot - ${botName} is running...`);

  return telegram;
};

export default telegramService;