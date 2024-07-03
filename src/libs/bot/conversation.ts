import { ActivityHandler, StatePropertyAccessor, UserState, BotState, MessageFactory } from 'botbuilder';
import { processQuestion } from "../trainModel";

const WELCOMED_USER = 'welcomedUserProperty';
const CONVERSATION_DATA_PROPERTY = 'conversationData';
const USER_PROFILE_PROPERTY = 'userProfile';

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
    public currentConversationReferences: any;
    private conversationState: BotState;
    private userState: UserState;
    private welcomedUserProperty: StatePropertyAccessor<boolean>;
    private conversationDataAccessor: StatePropertyAccessor<BotState>;
    private userProfileAccessor: StatePropertyAccessor<BotState>;
    /**
     *
     * @param {ConversationState} conversationState
     * @param {UserState} userState
     * @param {any} conversationReferences
     */
    constructor(conversationState: BotState, userState: UserState, conversationReferences?: any) {
        super();
        if (!conversationState) throw new Error('[ConversationBot]: Missing parameter. conversationState is required');
        if (!userState) throw new Error('[ConversationBot]: Missing parameter. userState is required');

        this.conversationDataAccessor = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);
        this.userProfileAccessor = userState.createProperty(USER_PROFILE_PROPERTY);

        this.conversationState = conversationState as ConversationState;
        this.userState = userState as UserState;

        this.welcomedUserProperty = this.userState.createProperty(WELCOMED_USER);

        this.currentConversationReferences = conversationReferences;

        this.onMessage(async (context, next) => {
            addConversationReference(context.activity);
            
            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);
            const userProfile = await this.userProfileAccessor.get(context, {});
            const conversationData = await this.conversationDataAccessor.get(context, {});

            if (didBotWelcomedUser === false) {
                const userName = context.activity.from.name;
                await context.sendActivity('You are seeing this message because this was your first message ever sent to this bot.');
                await context.sendActivity(`It is a good practice to welcome the user and provide personal greeting. For example, welcome ${ userName }.`);

                await this.welcomedUserProperty.set(context, true);
            } else {
                conversationData.timestamp = context.activity.timestamp.toLocaleString();
                conversationData.channelId = context.activity.channelId;

                const answer = await processQuestion(context.activity.text.toLowerCase());

                await context.sendActivity(answer);
            }
            // Save updated utterance inputs.
            await logMessageText(this.userState, context);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (const idx in membersAdded) {
                if (membersAdded[idx].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome');
                }
            }

            await next();
        });

        this.onMembersRemoved(async (context, next) => {
            const membersRemoved = context.activity.membersRemoved;
            for (const idx in membersRemoved) {
                if (membersRemoved[idx].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome');
                    //await this._userState.ClearStateAsync(turnContext, cancellationToken);
                }
            }

            await next();
        });

        this.onConversationUpdate(async (context, next) => { 
            addConversationReference(context.activity);
            console.log('this gets called (conversation update)');
            await context.sendActivity('Welcome, enter an item to save to your list.'); 

            await next();
        });

        function addConversationReference(activity): void {
            const conversationReference = context.getConversationReference(activity);
            currentConversationReferences[conversationReference.conversation.id] = conversationReference;
        }
    }

    public async run(context): Promise<void> {
        await super.run(context);

        await this.conversationState.saveChanges(context, false);
        await this.userState.saveChanges(context, false);
    }
}