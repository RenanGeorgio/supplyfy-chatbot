import { InputHints, StatePropertyAccessor, TurnContext, BotState, UserState } from "botbuilder";
import {
  ComponentDialog,
  DialogSet,
  DialogState,
  DialogTurnResult,
  DialogTurnStatus,
  WaterfallDialog,
  WaterfallStepContext
} from "botbuilder-dialogs";
import { ConversationDialog } from "./conversationDialog";
import { NluManagerType } from "../types";
import { ChatDetails } from "../data";
import { CONVERSATION_DIALOG, MAIN_DIALOG, MAIN_WATERFALL_DIALOG, USER_PROFILE_PROPERTY } from "./constants";


export class MainDialog extends ComponentDialog {
  private recognizer: NluManagerType
  private userState: UserState;
  private userProfileAccessor: StatePropertyAccessor<BotState>;

  constructor(userState: UserState, manager: NluManagerType, conversationDialog: ConversationDialog) {
      super(MAIN_DIALOG);

      if (!manager) throw new Error('[MainDialog]: Missing parameter \'manager\' is required');
      this.recognizer = manager;

      if (!conversationDialog) throw new Error('[MainDialog]: Missing parameter \'conversationDialog\' is required');

      this.userState = userState;
      this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);

      this.addDialog(conversationDialog);

      // Define the main dialog and its related components.
      // This is a sample "book a flight" dialog.
      this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
        this.introStep.bind(this),
        this.actStep.bind(this),
        this.finalStep.bind(this)
      ]));
      /*
      this.addDialog(new TextPrompt('TextPrompt'))
          .addDialog(bookingDialog)
          .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
              this.introStep.bind(this),
              this.actStep.bind(this),
              this.finalStep.bind(this)
          ]));*/

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

  private async introStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    const mensagemcustomizada = null;

    if (mensagemcustomizada) {
      const msg = 'NOTE: NLU Manager is not configured.';
      await stepContext.context.sendActivity(msg);
    }

    return await stepContext.next();
  }

  /**
   * Second step in the waterall.  This will use LUIS to attempt to extract the origin, destination and travel dates.
   * Then, it hands off to the bookingDialog child dialog to collect any remaining details.
   */
  private async actStep(stepContext: WaterfallStepContext): Promise<DialogTurnResult> {
    const chatDetails = new ChatDetails();
    
    if (!this.recognizer.isConfigured) {
      return await stepContext.beginDialog(CONVERSATION_DIALOG, chatDetails);
    }
    
    const result = await this.recognizer.executeLuisQuery(stepContext.context);
    const intent = result.intent;
    
    if (intent) {
      return await stepContext.beginDialog(CONVERSATION_DIALOG, {});
    } else { // Catch all for unhandled intents
      const didntUnderstandMessageText = "Sorry, I didn't get that. Please try asking in a different way";
      await stepContext.context.sendActivity(didntUnderstandMessageText, didntUnderstandMessageText, InputHints.IgnoringInput);
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