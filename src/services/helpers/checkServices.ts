import { servicesActions } from "..";
import { IBotData } from "../../types/types";
import { emailServiceController } from "../email";
import { telegramServiceController } from "../telegram";

const ERROR_MESSAGES = {
  MISSING_FIELDS: "Campos obrigatórios ausentes",
  TELEGRAM_EXISTS: "Bot do telegram já existe",
  EMAIL_EXISTS: "Bot do e-mail já existe",
  INSTAGRAM_EXISTS: "Bot do instagram já existe",
  BOT_NOT_INITIALIZED: "O bot não foi inicializaço",
};

export const checkServices = async (
  existingBot: any,
  services: IBotData["services"]
) => {
  const serviceMessages = {
    telegram: ERROR_MESSAGES.TELEGRAM_EXISTS,
    email: ERROR_MESSAGES.EMAIL_EXISTS,
    instagram: ERROR_MESSAGES.INSTAGRAM_EXISTS,
  };

  for (const service in services) {
    if (existingBot.services && service in existingBot.services) {
      return { success: false, message: serviceMessages[service] };
    } else {
      const serviceControl = servicesActions[service];
      if (serviceControl) {
        await serviceControl.start(services[service]);
      }
    }
  }
  return { success: true, message: "" };
};
