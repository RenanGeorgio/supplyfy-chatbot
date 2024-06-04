import { findBot } from "../../helpers/findBot";
import { Events } from "../../types/enums";
import { webhookTrigger } from "../../webhooks/custom/webhookTrigger";
import { telegramServiceController } from "./index";

export default {
  key: "TelegramService",
  async handle({ data }) {
    const telegramService = findBot(
      data.serviceId,
      telegramServiceController.telegramServices
    );

    if (!telegramService) {
      throw new Error("Service not found");
    }

    const telegramBot = telegramService.telegramBot;

    const send = await telegramBot.sendMessage(
      data.id,
      data.message.text,
      data?.options
    );

    if (data?.webhookUrl) {
      webhookTrigger({
        url: data.webhookUrl,
        event: Events.MESSAGE_SENT,
        message: data.message,
        service: "telegram",
      });
    }
  },
  options: {
    attempts: 3,
    backoff: 1000,
    removeOnComplete: true,
  },
};