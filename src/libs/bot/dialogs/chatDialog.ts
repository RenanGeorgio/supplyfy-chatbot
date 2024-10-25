import { ComponentDialog, WaterfallDialog, WaterfallStepContext } from "botbuilder-dialogs";
import { CHAT_DIALOG, WATERFALL_DIALOG } from "./constants";

export class ChatDialog extends ComponentDialog {
    public doneOption: string;

    constructor() {
        super(CHAT_DIALOG);

        // Define a "done" response for the company selection prompt.
        this.doneOption = 'done';

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
            this.loopStep.bind(this)
        ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async loopStep(stepContext: WaterfallStepContext) {
        if (this.doneOption in stepContext.options) {
            // If they're done, exit and return their list.
            return await stepContext.endDialog();
        } else {
            // Otherwise, repeat this dialog, passing in the list from this iteration.
            return await stepContext.replaceDialog(this.initialDialogId);
        }
    }
}