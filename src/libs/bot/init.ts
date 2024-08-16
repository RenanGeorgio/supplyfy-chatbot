// // import { ConversationDialog } from "./dialogs/conversationDialog";
// // import { MainDialog } from "./dialogs/mainDialog";
// import { conversationReferences, conversationState, userState } from "./adapter";
// import { BotService } from "./conversation/service";
// // import { CONVERSATION_DIALOG } from "./dialogs/constants";
// // import { ConversationBot } from "./conversation/bot";
// // import { BotRecognizer } from "./reconizer/botRecognizer";
// import { ContainerType, ManagerType } from "./types";

// export class BotService {
//   private conversationBot: BotService
//   private manager: ManagerType
//   private container: ContainerType

//   /**
//    *
//    * @param {ManagerType} manager
//    * @param {ContainerType} container
//    */
//   constructor(manager: ManagerType, container: ContainerType) {
//     if (!manager) throw new Error('[BotService]: Missing parameter. manager is required');
//     if (!container) throw new Error('[BotService]: Missing parameter. container is required');
//     this.manager = manager;
//     this.container = container;
//     // const nluManager = this.manager.getNluManager
//     // const botRecognizer = new BotRecognizer(nluManager);
//     //const conversationDialog = new ConversationDialog(CONVERSATION_DIALOG);
//     //dialog = new MainDialog(userState, botRecognizer, conversationDialog);
//     this.conversationBot = new BotRoom(conversationState, userState, conversationReferences, this.container); 
//   }

//   public getBot(): BotRoom {
//     return this.conversationBot;
//   }
// }

