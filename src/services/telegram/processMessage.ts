import { DirectlineService, MsgToBot } from "../../libs/bot/connector/directLine";
import { Platforms } from "../../types/enums";
import { BotMsgValue } from "../../types/types";

interface TelegramMessage {
    senderChatId: string
    senderId: string
    text: string
    origin: {
        chatId: string
    }
    credentials: {
        _id: string
    }
    createdAt: number,
    updatedAt: number,
}

export function sendTelegramText(info: TelegramMessage) {
    const value: any = {
        service: Platforms.TELEGRAM,
        companyId: info.credentials._id,
        ...info
    } 
    
    const data: MsgToBot = {
        text: info.text,
        id: info.senderChatId,
        value
    };

    const directLineService = DirectlineService.getInstance();

    directLineService.sendMessageToBot(data);
}