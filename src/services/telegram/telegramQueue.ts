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

    await telegramService.telegramBot.sendMessage(data.id, data.message);
  },
  options: {
    attempts: 3,
    backoff: 1000,
    removeOnComplete: true,
  },
};
