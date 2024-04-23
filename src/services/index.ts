import { listAllBots } from "../repositories/bot";
import { telegramServiceController } from "./telegram";
import { emailServiceController } from "./email";
import { instagramServiceController } from "./instagram";
import { socketServiceController } from "./socket";
import { webhookPromiseHandler } from "./webhook/webhookHandler";
import { messengerServiceController } from "./facebook";
import whatsappWebService from "./whatsapp-web";

import './queue';
import { IBotData } from "../types";

(async () => {
  const bots = await listAllBots();
  for (const bot of bots) {
    // inicializar os serviços quando o servidor iniciar ?
    if(bot.socket) {
      socketServiceController.start(bot.socket as any);
    }
    if (bot.services?.telegram) {
      await telegramServiceController.start(bot.services.telegram as any);
    }
    if (bot.services?.email) {
      emailServiceController.start(bot.services.email as any);
    }
    // if(bot.services?.instagram) {
    //   instagramServiceController.start(bot.services.instagram);
    // }
    if (bot.services?.facebook) {
      messengerServiceController.start(bot.services.facebook);
    }
  }
})();

// somente para teste

whatsappWebService("1");

const servicesActions = {
  telegram: telegramServiceController,
  email: emailServiceController,
  instagram: instagramServiceController,
  socket: socketServiceController,
  facebook: messengerServiceController
  // whastapp
};

export { whatsappWebService, servicesActions, webhookPromiseHandler };