import { DirectlineService, MsgToBot } from "../../libs/bot/connector/directLine";
import { Platforms } from "../../types/enums";
import { BotMsgValue } from "../../types/types";

interface TelegramMessage {
    id: string
    senderId: string
    message: {
        text: string
    }
    origin: {
        chatId: string
    }
}

export function sendTelegramText(info: TelegramMessage) {
    const value: BotMsgValue = {
        service: Platforms.TELEGRAM,
        to: info.origin.chatId,
        messageId: info.id,
        phoneNumber: "undefined",
        phoneNumberId: "undefined",
        name: undefined,
    } 
    
    const data: MsgToBot = {
        text: info.message.text,
        id: info.senderId,
        value
    };

    const directLineService = DirectlineService.getInstance();

    directLineService.sendMessageToBot(data);
}