// import { ConversationDialog } from "./dialogs/conversationDialog";
// import { MainDialog } from "./dialogs/mainDialog";
import { conversationReferences, conversationState, userState } from "./adapter";
import { BotRoom } from "./conversation/room";
// import { CONVERSATION_DIALOG } from "./dialogs/constants";
// import { ConversationBot } from "./conversation/bot";
import { BotRecognizer } from "./reconizer/botRecognizer";
import { ManagerType } from "./types";

export class BotService {
  private conversationBot: BotRoom
  private currentManagerService: any

  /**
   *
   * @param {ManagerType} manager
   */
  constructor(manager: ManagerType) {
    if (!manager) throw new Error('[BotService]: Missing parameter. manager is required');
    
    this.currentManagerService = manager;

    const nluManager = this.currentManagerService.getNluManager
    const botRecognizer = new BotRecognizer(nluManager);
    
    //const conversationDialog = new ConversationDialog(CONVERSATION_DIALOG);
    //dialog = new MainDialog(userState, botRecognizer, conversationDialog);
    this.conversationBot = new BotRoom(conversationState, userState, conversationReferences, this.currentManagerService); 
  }

  public getBot(): BotRoom {
    return this.conversationBot;
  }
}

