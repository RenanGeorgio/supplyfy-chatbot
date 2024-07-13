import { InputHints, MessageFactory, StatePropertyAccessor, TurnContext } from 'botbuilder';
import {
  ComponentDialog,
  DialogSet,
  DialogState,
  DialogTurnResult,
  DialogTurnStatus,
  TextPrompt,
  WaterfallDialog,
  WaterfallStepContext
} from 'botbuilder-dialogs';
import { BookingDialog } from './bookingDialog';
import { NluManagerType } from '../types';
const moment = require('moment');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

export class MainDialog extends ComponentDialog {
  private recognizer: NluManagerType

  constructor(manager: NluManagerType, bookingDialog: BookingDialog) {
      super('MainDialog');

      if (!manager) throw new Error('[MainDialog]: Missing parameter \'manager\' is required');
      this.recognizer = manager;

      if (!bookingDialog) throw new Error('[MainDialog]: Missing parameter \'bookingDialog\' is required');

      // Define the main dialog and its related components.
      // This is a sample "book a flight" dialog.
      this.addDialog(new TextPrompt('TextPrompt'))
          .addDialog(bookingDialog)
          .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
              this.introStep.bind(this),
              this.actStep.bind(this),
              this.finalStep.bind(this)
          ]));

      this.initialDialogId = MAIN_WATERFALL_DIALOG;
  }

  /**
   * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
   * If no dialog is active, it will start the default dialog.
   * @param {TurnContext} context
   */
  public async run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>) {
    const dialogSet = new DialogSet(accessor);
    dialogSet.add(this);

    const dialogContext = await dialogSet.createContext(context);
    const results = await dialogContext.continueDialog();
    if (results.status === DialogTurnStatus.empty) {
      await dialogContext.beginDialog(this.id);
    }
  }

  /**
   * First step in the waterfall dialog. Prompts the user for a command.
   * Currently, this expects a booking request, like "book me a flight from Paris to Berlin on march 22"
   * Note that the sample LUIS model will only recognize Paris, Berlin, New York and London as airport cities.
   */
  private async introStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    if (!this.recognizer.isConfigured) {
      const configMsg = 'NOTE: NLU Manager is not configured.';
      await stepContext.context.sendActivity(configMsg, null, InputHints.IgnoringInput);
      return await stepContext.next();
    }

    const weekLaterDate = moment().add(7, 'days').format('MMMM D, YYYY');
    const messageText = (stepContext.options as any).restartMsg ? (stepContext.options as any).restartMsg : `What can I help you with today?\nSay something like "Book a flight from Paris to Berlin on ${ weekLaterDate }"`;
    const promptMessage = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
    return await stepContext.prompt('TextPrompt', { prompt: promptMessage });
  }

  /**
   * Second step in the waterall.  This will use LUIS to attempt to extract the origin, destination and travel dates.
   * Then, it hands off to the bookingDialog child dialog to collect any remaining details.
   */
  private async actStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {

    const result = await this.recognizer.executeLuisQuery(stepContext.context);
    switch (result.intent) {
      case 'BookFlight': {
        

        // Run the BookingDialog passing in whatever details we have from the LUIS call, it will fill out the remainder.
        return await stepContext.beginDialog('bookingDialog', {});
      }
      default: {
        // Catch all for unhandled intents
        const didntUnderstandMessageText = "Sorry, I didn't get that. Please try asking in a different way";
        await stepContext.context.sendActivity(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
      }
    }

    return await stepContext.next();
  }
  
  private async finalStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    if (stepContext.result) {
     
      const msg = "";
      await stepContext.context.sendActivity(msg);
    }

    // Restart the main dialog waterfall with a different message the second time around
    return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
  }
}