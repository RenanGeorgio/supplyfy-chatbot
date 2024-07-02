import { ActivityHandler, StatePropertyAccessor, UserState, MessageFactory } from 'botbuilder';

const WELCOMED_USER = 'welcomedUserProperty'; // Welcomed User property name

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

export class WelcomeBot extends ActivityHandler {
    private welcomedUserProperty: StatePropertyAccessor<boolean>;
    private userState: UserState;
    /**
     *
     * @param {UserState} User state to persist boolean flag to indicate if the bot had already welcomed the user
     *                    
     */
    constructor(userState: UserState) {
        super();

        this.welcomedUserProperty = userState.createProperty(WELCOMED_USER);
        this.userState = userState;

        this.onMessage(async (context, next) => {
            // Read UserState. If the 'DidBotWelcomedUser' does not exist (first time ever for a user), set the default to false.
            const didBotWelcomedUser = await this.welcomedUserProperty.get(context, false);

            // Your bot should proactively send a welcome message to a personal chat the first time (and only the first time) a user initiates a personal chat with your bot.
            if (didBotWelcomedUser === false) {
                const userName = context.activity.from.name; // The channel should send the user name in the 'From' object
                await context.sendActivity('You are seeing this message because this was your first message ever sent to this bot.');
                await context.sendActivity(`It is a good practice to welcome the user and provide personal greeting. For example, welcome ${ userName }.`);

                await this.welcomedUserProperty.set(context, true); // Set the flag indicating the bot handled the user's first message.
            } else {
                const text = context.activity.text.toLowerCase();
                await context.sendActivity(text);
            }
            // Save state changes
            await this.userState.saveChanges(context);

            // Save updated utterance inputs.
            await logMessageText(this.userState, context);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // Sends welcome messages to conversation members when they join the conversation.
        // Messages are only sent to conversation members who aren't the bot.
        this.onMembersAdded(async (context, next) => {
            // Iterate over all new members added to the conversation
            for (const idx in context.activity.membersAdded) {
                // Greet anyone that was not the target (recipient) of this message.
                // Since the bot is the recipient for events from the channel,
                // context.activity.membersAdded === context.activity.recipient.Id indicates the
                // bot was added to the conversation, and the opposite indicates this is a user.
                if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
                    await context.sendActivity('Welcome to the \'Welcome User\' Bot. This bot will introduce you to welcoming and greeting users.');
                    await context.sendActivity('You are seeing this message because the bot received at least one \'ConversationUpdate\' ' +
                        'event, indicating you (and possibly others) joined the conversation. If you are using the emulator, ' +
                        'pressing the \'Start Over\' button to trigger this event again. The specifics of the \'ConversationUpdate\' ' +
                        'event depends on the channel. You can read more information at https://aka.ms/about-botframework-welcome-user');
                    await context.sendActivity('It is a good pattern to use this event to send general greeting to user, explaining what your bot can do. ' +
                        'In this example, the bot handles \'hello\', \'hi\', \'help\' and \'intro\'. ' +
                        'Try it now, type \'hi\'');
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onConversationUpdate(async (context) => { 
            console.log('this gets called (conversation update)');
            await context.sendActivity('Welcome, enter an item to save to your list.'); 
        });
    }
}