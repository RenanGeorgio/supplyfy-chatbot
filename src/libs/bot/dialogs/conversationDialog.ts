import { TimexProperty } from "@microsoft/recognizers-text-data-types-timex-expression";
import { DialogTurnResult, WaterfallDialog, WaterfallStepContext } from "botbuilder-dialogs";
import { BookingDetails } from "./bookingDetails";
import { CancelAndHelpDialog } from "./cancelAndHelpDialog";
import { ChatDialog } from "./chatDialog";

const DATE_RESOLVER_DIALOG = 'dateResolverDialog';
const WATERFALL_DIALOG = 'waterfallDialog';

export class ConversationDialog extends CancelAndHelpDialog {
    constructor() {
        super('conversationDialog');

        this.addDialog(new ChatDialog());

        this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.travelDateStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    /**
     * If a travel date has not been provided, prompt for one.
     * This will use the DATE_RESOLVER_DIALOG.
     */
    private async travelDateStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        const bookingDetails = stepContext.options as BookingDetails;

        // Capture the results of the previous step
        bookingDetails.origin = stepContext.result;
        if (!bookingDetails.travelDate || this.isAmbiguous(bookingDetails.travelDate)) {
            return await stepContext.beginDialog(DATE_RESOLVER_DIALOG, { date: bookingDetails.travelDate });
        } else {
            return await stepContext.next(bookingDetails.travelDate);
        }

        return await stepContext.beginDialog(REVIEW_SELECTION_DIALOG);
    }

    /**
     * Complete the interaction and end the dialog.
     */
    private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
        if (stepContext.result === true) {
            const bookingDetails = stepContext.options as BookingDetails;

            return await stepContext.endDialog(bookingDetails);
        }
        return await stepContext.endDialog();
    }

    private isAmbiguous(timex: string): boolean {
        const timexPropery = new TimexProperty(timex);
        return !timexPropery.types.has('definite');
    }
}