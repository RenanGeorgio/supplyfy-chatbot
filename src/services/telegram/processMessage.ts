import { DirectlineService } from "../../libs/bot/connector/directLine";

interface TelegramMessage {
  id: string;
  message: {
    text: string;
  };
  origin: {
    chatId: string;
  };
}

export function sendTelegramText(info: TelegramMessage , messageText: string) {
  const data = {
    id: info.id,
    recipientId: info.origin.chatId,
    text: messageText,
  };

  const directLineService = DirectlineService.getInstance();

  
  directLineService.sendMessageToBot(data); 
}