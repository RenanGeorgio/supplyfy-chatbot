import { findBot, removeBot } from "../../helpers/findBot";
import { ITelegramServiceController } from "../../types";
import { Events } from "../../types/types";
import telegramService from "./telegramService";

export const telegramServiceController: ITelegramServiceController = {
  telegramServices: [],

  async start(credentials, webhook) {
    const id = credentials._id?.toString()!;
    const bot = findBot(id, this.telegramServices);

    if (bot) {
      return {
        success: false,
        event: Events.SERVICE_ALREADY_RUNNING,
        message: "serviço já está rodando",
        service: "telegram",
      };
    }

    const telegram = await telegramService(credentials, webhook);

    if (!telegram) {
      return {
        success: false,
        event: Events.SERVICE_ERROR,
        message: "não autorizado",
        service: "telegram",
      };
    }

    this.telegramServices.push({
      id,
      telegramBot: telegram,
    });

    return {
      success: true,
      event: Events.SERVICE_STARTED,
      message: "serviço iniciado",
      service: "telegram",
    };
  },

  async stop(credentials) {
    const id = credentials._id?.toString()!;
    const bot = findBot(id, this.telegramServices);

    if (bot) {
      bot.telegramBot.stopPolling();
      bot.telegramBot.removeAllListeners();
      removeBot(bot, this.telegramServices);
      return {
        success: true,
        event: Events.SERVICE_STOPPED,
        message: "serviço parado",
        service: "telegram",
      };
    }
    return {
      success: false,
      event: Events.SERVICE_NOT_RUNNING,
      message: "serviço não está rodando",
      service: "telegram",
    };
  },

  async resume(credentials) {
    const id = credentials._id?.toString()!;
    const bot = findBot(id, this.telegramServices);

    if (bot) {
      bot.telegramBot.startPolling();
      return {
        success: true,
        event: Events.SERVICE_STARTED,
        message: "serviço iniciado",
        service: "telegram",
      };
    }

    return {
      success: false,
      event: Events.SERVICE_NOT_RUNNING,
      message: "serviço não encontrado",
      service: "telegram",
    };
  },
};