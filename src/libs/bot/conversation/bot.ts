import { ActivityHandler, StatePropertyAccessor, UserState, ConversationState, BotState, ActivityTypes } from "botbuilder";
import { TurnContext, ConversationReference } from "botbuilder-core";
import { Dialog, DialogState } from "botbuilder-dialogs";
import { CONVERSATION_DATA_PROPERTY, USER_PROFILE_PROPERTY } from "../dialogs/constants";
import { NlpService } from "../nlp/manager";


async function logMessageText(storage, context: TurnContext) { // This function stores new user messages. Creates new utterance log if none exists.
  let utterance = context.activity.text;

  try {
    let storeItems = await storage.read(["UtteranceLogJS"]);
    var UtteranceLogJS = storeItems["UtteranceLogJS"];

    if ((typeof (UtteranceLogJS)) != 'undefined') { // The log exists so we can write to it.
      storeItems["UtteranceLogJS"].turnNumber++;
      storeItems["UtteranceLogJS"].UtteranceList.push(utterance);

      var storedString = storeItems.UtteranceLogJS.UtteranceList.toString(); // Gather info for user message.
      var numStored = storeItems.UtteranceLogJS.turnNumber;

      try {
        await storage.write(storeItems);
        await context.sendActivity(`${numStored}: The list is now: ${storedString}`);
      } catch (err) {
        await context.sendActivity(`Write failed of UtteranceLogJS: ${err}`);
      }
    } else {
      await context.sendActivity(`Creating and saving new utterance log`);

      var turnNumber = 1;
      storeItems["UtteranceLogJS"] = { UtteranceList: [`${utterance}`], "eTag": "*", turnNumber }

      var storedString = storeItems.UtteranceLogJS.UtteranceList.toString(); // Gather info for user message.
      var numStored = storeItems.UtteranceLogJS.turnNumber;

      try {
        // Redirecionar mensagens de log
        await storage.write(storeItems);
      } catch (err: any) {
        console.log(`Write failed: ${err}`);
      }
    }
  } catch (err: any) {
    console.log(`Read rejected. ${err}`);
  }
}

export class ConversationBot extends ActivityHandler {
  public currentConversationReferences: ConversationReference[];
  private conversationState: BotState;
  private userState: UserState;
  private dialog: Dialog | undefined;
  private conversationDataAccessor: StatePropertyAccessor<DialogState>;
  private userProfileAccessor: StatePropertyAccessor<UserState>;
  private currentManager: NlpService
  private botRecognizer: any
  /**
   *
   * @param {ConversationState} conversationState
   * @param {UserState} userState
   * @param {ConversationReference[]} conversationReferences
   * @param {NlpService} currentManager
   * @param {BotRecognizer} botRecognizer
   */
  constructor(conversationState: BotState, userState: UserState, conversationReferences: ConversationReference[], currentManager: NlpService, botRecognizer: any, dialog?: Dialog) {
    super();

    if (!conversationState) {
      throw new Error('[ConversationBot]: Missing parameter. conversationState is required');
    }

    if (!userState) {
      throw new Error('[ConversationBot]: Missing parameter. userState is required');
    }

    this.conversationState = conversationState as ConversationState;
    this.userState = userState as UserState;
    this.currentConversationReferences = conversationReferences as ConversationReference[];

    this.currentManager = currentManager;
    this.botRecognizer = botRecognizer;
    this.dialog = dialog;

    this.conversationDataAccessor = conversationState.createProperty<DialogState>(CONVERSATION_DATA_PROPERTY);
    this.userProfileAccessor = userState.createProperty<UserState>(USER_PROFILE_PROPERTY);

    this.onMessage(async (context: TurnContext, next) => {
      this.addConversationReference(context.activity);

      const userProfile = await this.userProfileAccessor.get(context);
      const conversationData = await this.conversationDataAccessor.get(context);

      // COMO PODEMOS MANDAR A MENSAGEM QUANDO O USUARIO ENTRA NO CHAT, ESTA MENSAGEM PODE NAO SER NECESSARIA
      /*if (didBotWelcomedUser === false) {
        const userName = context.activity.from.name;
        await context.sendActivity('You are seeing this message because this was your first message ever sent to this bot.');
        await context.sendActivity(`It is a good practice to welcome the user and provide personal greeting. For example, welcome ${ userName }.`);

        await this.welcomedUserProperty.set(context, true);
      } else {
        
      }*/

      conversationData.timestamp = context.activity.timestamp.toLocaleString();
      conversationData.locale = context.activity.locale;
      conversationData.channelId = context.activity.channelId;

      const text = context.activity.text.trim().toLocaleLowerCase();
      
      if (text) {
        const id = context.activity.from.id;
        const conversationId = context.activity.conversation.id;
        
        const useData = context.activity?.value;

        if (userProfile) {
          userProfile.userId = id;
          userProfile.userName = context.activity.from.name;
          userProfile.info = useData;
        }

        // executar intend recognition
        //const result = await this.botRecognizer.executeLuisQuery(text);
        //const intent = result.intent;

        const answer = await this.currentManager.executeConversation(id, text);

        // enviar 'answer' para o LLM
        // TO-DO: recever valor
        const llm =""
        if (llm) {
          const activity = { 
            type: ActivityTypes.Message, 
            text: answer,
            value: {
              ...useData,
              company: useData.company,
              channel: useData.service
            }
          }
          
          //Promise<ResourceResponse | undefined>
          await context.sendActivity(activity);
        } else {
          const activity = { 
            type: 'transfer',
            value: {
              ...useData,
              company: useData.company,
              channel: useData.service
            }
          }
          
          //Promise<ResourceResponse | undefined>
          await context.sendActivity(activity);
        }
      }

      // Save updated utterance inputs.
      await logMessageText(this.userState, context);

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onConversationUpdate(async (context, next) => {
      this.addConversationReference(context.activity);

      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      // console.log(context.activity)
      for (const idx in membersAdded) {
        if (membersAdded[idx].id !== context.activity.recipient.id) {
          await currentManager.createConversation(context.activity.conversation.id, membersAdded[idx].id);

          // await context.sendActivity('Welcome');
          // await (dialog as MainDialog).run(context, conversationState.createProperty<DialogState>('DialogState'));
        }
      }

      await next();
    });

    this.onMembersRemoved(async (context, next) => {
      const membersRemoved = context.activity.membersRemoved;
      for (const idx in membersRemoved) {
        if (membersRemoved[idx].id !== context.activity.recipient.id) {
          await currentManager.deleteConversation(context.activity.conversation.id, membersRemoved[idx].id);
          await this.userState.clear(context);
        }
      }

      await next();
    });
  }

  private addConversationReference(activity: any): void {
    const conversationReference: ConversationReference = TurnContext.getConversationReference(activity) as ConversationReference;
    this.currentConversationReferences[conversationReference.conversation.id] = conversationReference;
  }

  public async run(context: TurnContext): Promise<void> {
    await super.run(context);

    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}
