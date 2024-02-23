import { TelegramServiceController } from "../../types/types";
import telegramService from "./telegramService";

export const telegramServiceController: TelegramServiceController = {
  telegramService: [],

  start: async (token: string) => {
    const telegram = await telegramService(token);
    telegramServiceController.telegramService.push(telegram);
    return telegram;
  },

  stop: async (botUsername: string) => {
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
