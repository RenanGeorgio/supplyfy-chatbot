import { findTelegramBot } from "../../helpers/findTelegramBot";
import { TelegramServiceController } from "../../types/types";
import telegramService from "./telegramService";

export const telegramServiceController: TelegramServiceController = {
  telegramService: [],

  async start(token: string) {
    const telegram = await telegramService(token);
    if(!telegram) {
      return null;
    }
    this.telegramService.push(telegram);
    return telegram;
  },

  async stop(botUsername: string) {
    const bot = await findTelegramBot(this.telegramService, botUsername);
    if (bot) {
      bot.stopPolling();
      return true;
    }
    return false;
  },

  async resume(botUsername: string) {
    const bot = await findTelegramBot(this.telegramService, botUsername);
    if (bot) {
      bot.startPolling();
      return true;
    }
    return false;
  },
};
