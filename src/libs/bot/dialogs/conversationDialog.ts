import { DialogTurnResult, WaterfallDialog, WaterfallStepContext } from "botbuilder-dialogs";
import { CancelAndHelpDialog } from "./cancelAndHelpDialog";
import { ChatDialog } from "./chatDialog";
import { ChatDetails } from "../data";
import { CHAT_DIALOG, CONVERSATION_DIALOG, WATERFALL_DIALOG } from "./constants";

export class ConversationDialog extends CancelAndHelpDialog {
    constructor(id?: string) {
        super(id || CONVERSATION_DIALOG);

        this.addDialog(new ChatDialog());

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.chatStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    private async chatStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const chatDetails = stepContext.options as ChatDetails;

        // Capture the results of the previous step
        chatDetails.origin = stepContext.result;
        if (!chatDetails.travelDate) {
            return await stepContext.beginDialog(CHAT_DIALOG, { date: chatDetails.travelDate });
        } else {
            return await stepContext.next(chatDetails.travelDate);
        }
    }
       return await stepContext.beginDialog(CHAT_DIALOG);
    /**
     * Complete the interaction and end the dialog.
     */
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (stepContext.result === true) {
            const chatDetails = stepContext.options as ChatDetails;

            return await stepContext.endDialog(chatDetails);
        }
        return await stepContext.endDialog();
    }
}
