import { IBotData } from "../../types/types";

const STATUS_MESSAGES = {
  MISSING_FIELDS: "Campos obrigatórios ausentes",
  TELEGRAM_EXISTS: "Bot do telegram já existe",
  EMAIL_EXISTS: "Bot do e-mail já existe",
  INSTAGRAM_EXISTS: "Bot do instagram já existe",
  BOT_NOT_INITIALIZED: "O bot não foi inicializaço",
};

export const checkServices = async (
  existingBot: IBotData,
  services: IBotData["services"]
) => {
  const serviceMessages = {
    telegram: STATUS_MESSAGES.TELEGRAM_EXISTS,
    email: STATUS_MESSAGES.EMAIL_EXISTS,
    instagram: STATUS_MESSAGES.INSTAGRAM_EXISTS,
  };

  for (const service in services) {
    if (existingBot.services && existingBot.services[service]) {
      return { success: false, message: serviceMessages[service] };
    }
  }
  return { success: true, message: "" };
};