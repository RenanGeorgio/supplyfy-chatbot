import { mongoErrorHandler } from "../helpers/errorHandler";
import MessageModel from "../models/chat/messageModel";

export async function createMessage(sender: string, chat: string, messageText: string){
    try {
        const { chatId, senderId, text, createdAt, updatedAt } = await MessageModel.create({
            senderId: sender,
            chatId: chat,
            text: messageText,
        })

        return { chatId, senderId, text, createdAt, updatedAt };
    }
    catch (error) {
        return mongoErrorHandler(error);
    }
}

export async function listChatMessages(chatId: string){
    try {
        return await MessageModel.find({ chatId });
    }
    catch (error) {
        mongoErrorHandler(error);
    }
}