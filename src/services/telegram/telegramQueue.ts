import { findBot } from "../../helpers/findBot";
import { telegramServiceController } from "./index";

export default {
  key: "TelegramService",
  async handle({ data }) {
    const telegramService = findBot(
      data.serviceId,
      telegramServiceController.telegramServices
    );

    if (!telegramService) {
      return false;
    }
    const telegramBot = telegramService.telegramBot

    await telegramBot.sendMessage(data.id, data.message, data?.options);
    
  },
  options: {
    attempts: 3,
    backoff: 1000,
    removeOnComplete: true,
  },
};