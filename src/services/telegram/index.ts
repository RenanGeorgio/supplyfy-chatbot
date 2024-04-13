import { findBot } from "../../helpers/findBot";
import { ITelegramServiceController } from "../../types";
import telegramService from "./telegramService";

export const telegramServiceController: ITelegramServiceController = {
  telegramServices: [],

  async start(credentials: any, token?: string) {
    const id = credentials._id?.toString()!;

    const token = credentials.token;
    const telegram = await telegramService(token);
    
    if (!telegram) {
      return null; // enviar evento de erro
    }

    this.telegramServices.push({
      id,
      telegramBot: telegram,
    });

    return telegram;
  },

  async stop(id: number | string) {
    const bot = findBot(id, this.telegramServices);
    if (bot) {
      bot.telegramBot.stopPolling();
      return true;
    }
    return false;
  },

  async resume(id: number | string) {
    const bot = findBot(id, this.telegramServices);
    if (bot) {
      bot.telegramBot.startPolling();
      return true;
    }
    return false;
  },
};
