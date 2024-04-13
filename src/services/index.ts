/*
FEITO PELO SAMUEL
import { emailServiceController } from "./email";
import { instagramServiceController } from "./instagram";
*/
import emailService from "./email/listener";
//import emailService from "./email"; original
import instagramService from "./instagram";
import { telegramServiceController } from "./telegram";
//import telegramService from "./telegram"; original
import whatsappWebService from "./whatsapp-web";

// import ChatService from "./chatSocket";
import { listAllBots } from "../repositories/bot";

(async () => {
  const bots = await listAllBots();
  for (const bot of bots) {
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
  instagram: instagramServiceController
  // whastapp
};

export { whatsappWebService, servicesActions };
*/

// export { emailService, instagramService, telegramService, whatsappWebService }; original
export { emailService, instagramService, telegramServiceController, whatsappWebService };