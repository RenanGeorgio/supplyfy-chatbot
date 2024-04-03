import { emailServiceController } from "./email";
import { instagramServiceController } from "./instagram";
import { telegramServiceController } from "./telegram";
import whatsappWebService from "./whatsapp-web";

// import ChatService from "./chatSocket";
import { listAllBots } from "../repositories/bot";

(async () => {
  const bots = await listAllBots();
  for (const bot of bots) {
    if (bot.services?.telegram) {
      await telegramServiceController.start(bot.services.telegram);
    }
    if (bot.services?.email) {
      emailServiceController.start(bot.services.email);
    }
    if(bot.services?.instagram) {
      instagramServiceController.start(bot.services.instagram);
    }
  }
})();

const servicesActions = {
  telegram: telegramServiceController,
  email: emailServiceController,
  instagram: instagramServiceController
  // whastapp
};

export { whatsappWebService, servicesActions };