// import { BotRecognizer } from "./reconizer/botRecognizer";
// import { ConversationDialog } from "./dialogs/conversationDialog";
// import { MainDialog } from "./dialogs/mainDialog";
import { conversationReferences, conversationState, userState } from "./adapter";
import { ConversationBot } from "./conversation/bot";
import { ConversationDialog } from "./dialogs/conversationDialog";
import { MainDialog } from "./dialogs/mainDialog";
import { NlpService } from "./nlp/manager";
import { BotRecognizer } from "./reconizer/botRecognizer";
import { CONVERSATION_DIALOG } from "./dialogs/constants";
// import { Dialog } from "botbuilder-dialogs";

export class BotService {
    private conversationBot: ConversationBot
    private currentManagerService: NlpService

    /**
     *
     * @param {NlpService} manager
     */
    constructor(manager: NlpService) {
        if (!manager) throw new Error('[BotService]: Missing parameter. manager is required');

        this.currentManagerService = manager;
        let dialog: MainDialog | undefined = undefined;

        const nluManager = this.currentManagerService.getNluManager()
        const botRecognizer = new BotRecognizer(nluManager);

        const conversationDialog = new ConversationDialog(CONVERSATION_DIALOG);
        // dialog = new MainDialog(userState, botRecognizer, conversationDialog);
        // this.conversationBot = new BotRoom(conversationState, userState, conversationReferences, this.currentManagerService, dialog);
        this.conversationBot = new ConversationBot(conversationState, userState, conversationReferences, this.currentManagerService, dialog);
    }

    public getBot(): ConversationBot {
        return this.conversationBot;
    }
}
