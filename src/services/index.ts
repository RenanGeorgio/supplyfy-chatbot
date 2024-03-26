import emailService from "./email";
import instagramService from "./instagram";
import { telegramServiceController } from "./telegram";
import whatsappWebService from "./whatsapp-web";

// import ChatService from "./chatSocket";
import { listAllBots } from "../repositories/bot";
// import { telegramServiceController } from "./telegram";
// inicializar os serviços
// intagramService();
// emailService();
// whatsappWebService("1")

(async () => {

  const bots = await listAllBots();
  for (const bot of bots) {
    if (bot.services?.telegram) {
      const token = bot.services.telegram.token;
      await telegramServiceController.start(token);
    }
  }

})();

export { emailService, instagramService, telegramService, whatsappWebService };