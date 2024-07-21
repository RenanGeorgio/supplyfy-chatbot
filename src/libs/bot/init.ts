import { BotRecognizer } from "./reconizer/botRecognizer";
import { ConversationDialog } from "./dialogs/conversationDialog";
import { MainDialog } from "./dialogs/mainDialog";
import { conversationReferences, conversationState, userState } from "./adapter";
import { BotRoom } from "./conversation/room";
import { CONVERSATION_DIALOG } from "./dialogs/constants";
import { ConversationBot } from "./conversation/bot";
import { NluManagerType } from "./types";

export class BotService {
  private conversationBot: ConversationBot

  /**
   *
   * @param {NluManagerType} nluManager
   */
  constructor(nluManager: NluManagerType) {
    if (!nluManager) throw new Error('[BotService]: Missing parameter. nluManager is required');
    
    const botRecognizer = new BotRecognizer(nluManager);
    
    const conversationDialog = new ConversationDialog(CONVERSATION_DIALOG);
    const dialog = new MainDialog(userState, botRecognizer, conversationDialog); // COMPARAR OQ userState AGREGOU NESTE EXEMPLO
    this.conversationBot = new BotRoom(conversationState, userState, conversationReferences, dialog); 
  }

  public getBot(): ConversationBot {
    return this.conversationBot;
  }
}