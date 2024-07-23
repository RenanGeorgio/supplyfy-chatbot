import { BotRecognizer } from "./reconizer/botRecognizer";
import { ConversationDialog } from "./dialogs/conversationDialog";
import { MainDialog } from "./dialogs/mainDialog";
import { conversationReferences, conversationState, userState } from "./adapter";
import { BotRoom } from "./conversation/room";
import { CONVERSATION_DIALOG } from "./dialogs/constants";
import { ConversationBot } from "./conversation/bot";

export class BotService {
  private conversationBot: ConversationBot
  private currentManagerService: any

  /**
   *
   * @param {any} manager
   */
  constructor(manager: any) {
    if (!manager) throw new Error('[BotService]: Missing parameter. manager is required');
    
    this.currentManagerService = manager;
    let dialog: any = undefined;

    const nluManager = this.currentManagerService.getNluManager()
    const botRecognizer = new BotRecognizer(nluManager);
    
    //const conversationDialog = new ConversationDialog(CONVERSATION_DIALOG);
    //dialog = new MainDialog(userState, botRecognizer, conversationDialog);
    this.conversationBot = new BotRoom(conversationState, userState, conversationReferences, this.currentManagerService, dialog); 
  }

  public getBot(): ConversationBot {
    return this.conversationBot;
  }
}