import TelegramBot from "node-telegram-bot-api";
import { findTelegramBot } from "../../helpers/findTelegramBot";
import { IBotData } from "../../types";
import telegramService from "./telegramService";
import { ITelegramServiceController } from "../../types";

export const telegramServiceController = {
  telegramService: [] as TelegramBot[],

  async start(crendentials: IBotData["services"]["telegram"]) {
    const token = crendentials?.token;
    const telegram = await telegramService(token!);
    if (!telegram) {
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
} as ITelegramServiceController;
