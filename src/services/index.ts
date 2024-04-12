import { emailServiceController } from "./email";
import { instagramServiceController } from "./instagram";
import { telegramServiceController } from "./telegram";
import { socketServiceController } from "./socket";
import whatsappWebService from "./whatsapp-web";
import { webhookPromiseHandler } from "./webhook/webhookHandler";
// import ChatService from "./chatSocket";
import { listAllBots } from "../repositories/bot";


(async () => {
  const bots = await listAllBots();
  for (const bot of bots) {
    // inicializar os serviços quando o servidor iniciar ?

    // if (bot.services?.telegram) {
    //   await telegramServiceController.start(bot.services.telegram);
    // }
    // if (bot.services?.email) {
    //   emailServiceController.start(bot.services.email);
    // }
    // if(bot.services?.instagram) {
    //   instagramServiceController.start(bot.services.instagram);
    // }
  }
})();

const servicesActions = {
  telegram: telegramServiceController,
  email: emailServiceController,
  instagram: instagramServiceController,
  socket: socketServiceController
  // whastapp
};

export { whatsappWebService, servicesActions, webhookPromiseHandler };