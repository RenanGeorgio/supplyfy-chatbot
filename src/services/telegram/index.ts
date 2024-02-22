import TelegramBot from "node-telegram-bot-api";
import telegramService from "./telegramService";

export const telegramServiceController: {
  telegramService: TelegramBot[];
  start: (token: string) => Promise<TelegramBot>;
  stop: (botUsername: string) => Promise<boolean | null>;
} = {
  telegramService: [],

  start: async (token: string) => {
    const telegram = await telegramService(token);
    telegramServiceController.telegramService.push(telegram);
    return telegram;
  },

  stop: async (botUsername) => {
    if (telegramServiceController.telegramService.length === 0) {
      return false;
    }
    for (const telegramBot of telegramServiceController.telegramService) {
      const username = (await telegramBot.getMe()).username;
      if (username === botUsername) {
        telegramBot.stopPolling();
        return true;
      } else {
        return false;
      }
    }
    return null;
  },
};
