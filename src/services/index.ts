import { emailServiceController } from "./email";
import instagramService from "./instagram";
import { telegramServiceController } from "./telegram";
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

// instagramService();
// todo: chamar serviço de e-mail

export { emailServiceController, instagramService, telegramServiceController, whatsappWebService };