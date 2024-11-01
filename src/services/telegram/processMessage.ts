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
}

export function sendTelegramText(info: TelegramMessage) {
    const value: any = {
        service: Platforms.TELEGRAM,
        ...info
    } 
    
    const data: MsgToBot = {
        text: info.text,
        id: info.senderChatId,
        value
    };

    console.log("MESSAGE INFO: ", data)
    const directLineService = DirectlineService.getInstance();

    directLineService.sendMessageToBot(data);
}