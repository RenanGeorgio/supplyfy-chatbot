// import ChatService from "./chatSocket";
import { listAllBots } from "../repositories/bot";
import emailService from "./email/listener";
import intagramService from "./intagram/instagram";
import whatsappWebService from "./whatsapp/whatsapp";
import { telegramServiceController } from "./telegram";
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