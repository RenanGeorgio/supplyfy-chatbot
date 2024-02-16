import TelegramBot from "node-telegram-bot-api";
import { io } from "../index";
import Message from "../models/chat/Message";

const token = process.env.TELEGRAM_BOT_TOKEN;

const telegram = new TelegramBot(token as string, { polling: true });

const telegramService = () => {
    telegram.on("message", async (msg) => {
        const { chat, text, date } = msg;

        if (msg.text === "/start") {
            const userChat = await Message.findOne({ chatId: chat.id });

            if (!userChat) {
                const newUserChat = new Message({
                    name: chat.id,
                    chatId: chat.id,
                    date: date
                });
                await newUserChat.save();
            }
        }
        io.emit("chat message", { origin: "telegram", chat, text, date });
    });
};

export default telegramService;
