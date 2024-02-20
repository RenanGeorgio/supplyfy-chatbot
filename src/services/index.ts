import emailListener from "./email/listener";
import intagramService from "./intagram/instagram";
import telegramService from "./telegram";

// inicializar os serviços
telegramService();
// intagramService();
emailListener();