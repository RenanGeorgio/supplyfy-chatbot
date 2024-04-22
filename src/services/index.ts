import whatsappWebService from "./whatsapp-web";
import { listAllBots } from "../repositories/bot";
import { telegramServiceController } from "./telegram";
import { emailServiceController } from "./email";
import { instagramServiceController } from "./instagram";
import { socketServiceController } from "./socket";
import { webhookPromiseHandler } from "./webhook/webhookHandler";

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
  instagramWeb: instagramServiceController, // AVISAR SAMUEL DA TROCA DESTA LABEL
  socket: socketServiceController
  // whastapp
};

export { whatsappWebService, servicesActions, webhookPromiseHandler };