/*
FEITO PELO SAMUEL
import { emailServiceController } from "./email";
import { instagramServiceController } from "./instagram";
*/
import emailService from "./email/listener";
//import emailService from "./email"; original
import instagramService from "./instagram";
import { telegramServiceController } from "./telegram";
import { socketServiceController } from "./socket"; // SAMUEL
//import telegramService from "./telegram"; original
import whatsappWebService from "./whatsapp-web";
import { webhookPromiseHandler } from "./webhook/webhookHandler";
// import ChatService from "./chatSocket";
import { listAllBots } from "../repositories/bot";
// import { telegramServiceController } from "./telegram"; OLD


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

*/
FEITO PELO SAMUEL
const servicesActions = {
  telegram: telegramServiceController,
  email: emailServiceController,
  instagram: instagramServiceController,
  socket: socketServiceController
  // whastapp
};

export { whatsappWebService, servicesActions, webhookPromiseHandler };
*/

// export { emailService, instagramService, telegramService, whatsappWebService }; original
export { emailService, instagramService, telegramServiceController, whatsappWebService };