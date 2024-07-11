import { telegramServiceController } from "./telegram";
import { emailServiceController } from "./email";
import { instagramServiceController } from "./instagram";
import { socketServiceController } from "./socket";
import whatsappWebService from "./whatsapp-web";
import { messengerServiceController } from "./facebook";

import { webhookPromiseHandler } from "../webhooks/custom/webhookHandler";
import { listAllBots } from "../repositories/bot";
import { findWebhook } from "../repositories/webhook";

import { IWebhook } from "../types";

import "./queue";
import { whatsappServiceController } from "./whatsappTest";
import { DirectlineService } from "../libs/bot/connector/directLine";

const directLineService = DirectlineService.getInstance();
directLineService.subscribeBot("ignai-bot");

(async () => {
  const bots = await listAllBots();
  for (const bot of bots) {
    const webhook = await findWebhook({ companyId: bot.companyId } as any);
    
    if (bot.socket) {
      socketServiceController.start(bot.socket as any, webhook as IWebhook);
    }

    if (bot?.services?.telegram) {
      telegramServiceController.start(bot.services.telegram as any, webhook as IWebhook);
    }

    if (bot?.services?.email) {
      emailServiceController.start(bot.services.email as any, webhook as IWebhook);
    }

    // if(bot.services?.instagram) {
    //   instagramServiceController.start(bot.services.instagram);
    // }

    if (bot?.services?.facebook) {
      messengerServiceController.start(bot.services.facebook, webhook as IWebhook);
    }
    if(bot?.services?.whatsapp) {
      whatsappServiceController.start(bot.services.whatsapp, webhook as IWebhook);
    }
  }
})();

// whatsappWebService("1");

const servicesActions = {
  telegram: telegramServiceController,
  email: emailServiceController,
  instagramWeb: instagramServiceController,
  socket: socketServiceController,
  facebookWeb: messengerServiceController,
  whatsapp: whatsappServiceController,
};

export { whatsappWebService, servicesActions, webhookPromiseHandler };