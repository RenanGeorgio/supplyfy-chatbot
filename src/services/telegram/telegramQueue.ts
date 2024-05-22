import { findBot } from "../../helpers/findBot";
import { telegramServiceController } from "./index";

export default {
  key: "TelegramService",
  async handle({ data }) {
    const telegramService = findBot(
      data.serviceId,
      telegramServiceController.telegramServices
    );
    console.log("telegram service: ", telegramService)

    if (!telegramService) {
      return false;
    }
    const telegramBot = telegramService.telegramBot
    console.log("sending message", data)
    const test = await telegramBot.sendMessage(data.id, data.message, data?.options);
    console.log("test", test)
    // test.answerCallbackQuery(data.id, data.message);
  },
  options: {
    attempts: 3,
    backoff: 1000,
    removeOnComplete: true,
  },
};
