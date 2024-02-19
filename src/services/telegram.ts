import TelegramBot from "node-telegram-bot-api";
import Message from "../models/chat/Message";
import { processQuestion } from "../helpers/trainModel";

const token = process.env.TELEGRAM_BOT_TOKEN;

const telegram = new TelegramBot(token as string, { polling: true });

const telegramService = () => {
    telegram.on("message", async (msg) => {
        const { chat, text, date, from } = msg;

        if (from?.is_bot === false) {
            const answer = await processQuestion(text ?? "")
            if (text === "/start") {
                const userChat = await Message.findOne({ chatId: chat.id });
    
                if (!userChat) {
                    const newUserChat = new Message({
                        name: chat.first_name + " " + chat.last_name,
                        chatId: chat.id,
                        message: text,
                        answer: answer,
                        date: date
                    });
                    await newUserChat.save();
                }
            }else{
                const newUserChat = new Message({
                    name: chat.first_name + " " + chat.last_name,
                    chatId: chat.id,
                    message: text,
                    answer: answer,
                    date: date
                });
                await newUserChat.save();
            }
            
            telegram.sendMessage(chat.id, answer);
        }
        
    });
};

export default telegramService;
