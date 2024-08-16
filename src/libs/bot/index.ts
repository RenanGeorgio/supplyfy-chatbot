import { conversationState, userState, conversationReferences } from "./adapter";
import { BotService } from "./conversation/service";

const botService = new BotService(conversationState, userState, conversationReferences);
console.log("Bot service iniciado...")

export { botService };