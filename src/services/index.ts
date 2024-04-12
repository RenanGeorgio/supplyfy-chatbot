import emailService from "./email/listener";
//import emailService from "./email"; original
import instagramService from "./instagram";
import { telegramServiceController } from "./telegram";
//import telegramService from "./telegram"; original
import whatsappWebService from "./whatsapp-web";

// import ChatService from "./chatSocket";
import { listAllBots } from "../repositories/bot";
// import { telegramServiceController } from "./telegram";

(async () => {
  const bots = await listAllBots();
  for (const bot of bots) {
    if (bot.services?.telegram) {
      const token = bot.services.telegram.token;
      await telegramServiceController.start(token);
    }
  }
})();

// export { emailService, instagramService, telegramService, whatsappWebService }; original
export { emailService, instagramService, telegramServiceController, whatsappWebService };