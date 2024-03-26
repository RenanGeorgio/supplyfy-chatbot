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
        console.error(error);
    }
}