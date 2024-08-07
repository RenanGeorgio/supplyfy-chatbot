import { ActivityHandler, StatePropertyAccessor, UserState, ConversationState, BotState, MessageFactory, ActivityTypes } from "botbuilder";
import { TurnContext, ConversationReference } from "botbuilder-core";
import { Dialog, DialogState } from "botbuilder-dialogs";
import { CONVERSATION_DATA_PROPERTY, USER_PROFILE_PROPERTY, WELCOMED_USER } from "../dialogs/constants";
import { ManagerType } from "../types";

async function logMessageText(storage, context) { // This function stores new user messages. Creates new utterance log if none exists.
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
          await storage.write(storeItems);
          await context.sendActivity(`${numStored}: The list is now: ${storedString}`);
        } catch (err) {
          await context.sendActivity(`Write failed: ${err}`);
        }
      }
    } catch (err) {
      await context.sendActivity(`Read rejected. ${err}`);
    }
}

export class ConversationBot extends ActivityHandler {
  public currentConversationReferences: ConversationReference[];
  private conversationState: BotState;
  private userState: UserState;
  private dialog: Dialog;
  private conversationDataAccessor: StatePropertyAccessor<DialogState>;
  private userProfileAccessor: StatePropertyAccessor<BotState>;
  private currentManager: ManagerType
  private welcomedUserProperty: StatePropertyAccessor<boolean>;
  /**
   *
   * @param {ConversationState} conversationState
   * @param {UserState} userState
   * @param {ConversationReference[]} conversationReferences
   * @param {any} currentManager
   */
  constructor(conversationState: BotState, userState: UserState, conversationReferences: ConversationReference[], currentManager: any, dialog?: Dialog) {
    super();
    if (!conversationState) throw new Error('[ConversationBot]: Missing parameter. conversationState is required');
    if (!userState) throw new Error('[ConversationBot]: Missing parameter. userState is required');

    this.conversationState = conversationState as ConversationState;
    this.userState = userState as UserState;
    this.currentConversationReferences = conversationReferences as ConversationReference[];
    if (dialog){
      this.dialog = dialog;
    }

    this.currentManager = currentManager;

    this.conversationDataAccessor = conversationState.createProperty<DialogState>(CONVERSATION_DATA_PROPERTY);
    this.userProfileAccessor = userState.createProperty<UserState>(USER_PROFILE_PROPERTY);

    this.welcomedUserProperty = this.userState.createProperty(WELCOMED_USER);

    this.onMessage(async (context, next) => {
      this.addConversationReference(context.activity);
      
      const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);
      const userProfile = await this.userProfileAccessor.get(context, {});
      const conversationData = await this.conversationDataAccessor.get(context, {});

      // COMO PODEMOS MANDAR A MENSAGEM QUANDO O USUARIO ENTRA NO CHAT, ESTA MENSAGEM PODE NAO SER NECESSARIA
      /*if (didBotWelcomedUser === false) {
        const userName = context.activity.from.name;
        await context.sendActivity('You are seeing this message because this was your first message ever sent to this bot.');
        await context.sendActivity(`It is a good practice to welcome the user and provide personal greeting. For example, welcome ${ userName }.`);

        await this.welcomedUserProperty.set(context, true);
      } else {
        conversationData.timestamp = context.activity.timestamp.toLocaleString();
        conversationData.channelId = context.activity.channelId;

        const text = context.activity.text.trim().toLocaleLowerCase();
        // TO-DO: verificar quem é o usuario, puxar modelo e carregar por msg por conta de custo computacional e overflow do servidor
        this.manager.setModel('./model.nlp'); // trocar forma de carregamento, arquivo para json e etc.
        const answer = await this.manager.conversation.processQuestion(text);

        const activity = { type: ActivityTypes.Message, text: answer }
        await context.sendActivity(activity);
      }*/

      const text = context.activity.text.trim().toLocaleLowerCase();

      if (text) {
        const id = context.activity.from.id;
        userProfile.userId = id;
        userProfile.userName = context.activity.from.name;
        userProfile.info = context.activity?.value;

        conversationData.timestamp = context.activity.timestamp.toLocaleString();
        conversationData.locale = context.activity.locale;
        conversationData.channelId = context.activity.channelId;

        // TO-DO: verificar quem é o usuario, puxar modelo e carregar por msg por conta de custo computacional e overflow do servidor
        this.currentManager.setModel('./model.nlp'); // trocar forma de carregamento, arquivo para json e etc.
        const answer = await this.currentManager.executeConversation(id, text);

        const activity = { type: ActivityTypes.Message, text: answer }
        await context.sendActivity(activity);
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
  }

  private addConversationReference(activity): void {
    const conversationReference: ConversationReference = TurnContext.getConversationReference(activity);
    this.currentConversationReferences[conversationReference.conversation.id] = conversationReference;
  }

  public async run(context: TurnContext): Promise<void> {
    await super.run(context);

    await this.conversationState.saveChanges(context, false);
    await this.userState.saveChanges(context, false);
  }
}