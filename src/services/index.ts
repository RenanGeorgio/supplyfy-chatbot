import { listAllBots } from "../repositories/bot";
import { telegramServiceController } from "./telegram";
import { emailServiceController } from "./email";
import { instagramServiceController } from "./instagram";

import emailService from "./email/listener";
//import emailService from "./email"; original
import instagramService from "./instagram";
import { telegramServiceController } from "./telegram";
import { socketServiceController } from "./socket"; // SAMUEL
//import telegramService from "./telegram"; original
import whatsappWebService from "./whatsapp-web";
import { webhookPromiseHandler } from "./webhook/webhookHandler";

import { messengerServiceController } from "./facebook";
import whatsappWebService from "./whatsapp-web";
import "./queue";
import { IWebhook } from "../types";
import { getWebhook } from "../repositories/webhook";

// import ChatService from "./chatSocket";
import { listAllBots } from "../repositories/bot";
// import { telegramServiceController } from "./telegram"; OLD

(async () => {
  const bots = await listAllBots();
  for (const bot of bots) {
    const webhook = await getWebhook({ companyId: bot.companyId } as any);
    // inicializar os serviços quando o servidor iniciar ?
    if (bot.socket) {
      socketServiceController.start(bot.socket as any, webhook as IWebhook);
    }
    if (bot?.services?.telegram) {
      telegramServiceController.start(bot.services.telegram as any, webhook as IWebhook);
    }
    if (bot?.services?.email) {
      emailServiceController.start(bot.services.email as any,webhook as IWebhook);
    }
    // if(bot.services?.instagram) {
    //   instagramServiceController.start(bot.services.instagram);
    // }
    if (bot?.services?.facebook) {
      messengerServiceController.start(bot.services.facebook, webhook as IWebhook);
    }
  }
})();

// whatsappWebService("1");

const servicesActions = {
  telegram: telegramServiceController,
  email: emailServiceController,
  instagram: instagramServiceController,
  socket: socketServiceController,
  facebook: messengerServiceController,
  // whastapp
};

export { whatsappWebService, servicesActions, webhookPromiseHandler };
*/

// export { emailService, instagramService, telegramService, whatsappWebService }; original
export { emailService, instagramService, telegramServiceController, whatsappWebService };