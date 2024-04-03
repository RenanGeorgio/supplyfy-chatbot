import { emailServiceController } from "./email";
import instagramService from "./instagram";
import { telegramServiceController } from "./telegram";
import whatsappWebService from "./whatsapp-web";

// import ChatService from "./chatSocket";
import { listAllBots } from "../repositories/bot";

(async () => {
  const bots = await listAllBots();
  for (const bot of bots) {
    if (bot.services?.telegram) {
      const token = bot.services.telegram.token;
      await telegramServiceController.start(token);
    }
    if (bot.services?.email) {
      console.log(bot.services.email);
      emailServiceController.start(bot.services.email);
    }
  }
})();

const servicesActions = {
  telegram: telegramServiceController,
  email: emailServiceController,
  // instagram
  // whastapp
};

export {
  instagramService,
  whatsappWebService,
  servicesActions
};