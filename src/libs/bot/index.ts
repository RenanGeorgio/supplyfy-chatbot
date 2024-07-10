import {
  CloudAdapter,
  ConfigurationBotFrameworkAuthentication,
  ConfigurationBotFrameworkAuthenticationOptions,
  ConversationState,
  MemoryStorage,
  UserState,
  InputHints
} from 'botbuilder';
import { ConversationReference, ActivityTypes, TurnContext } from "botbuilder-core";
import * as HandleActivityType from "@botbuildercommunity/middleware-activity-type";
import { ConversationBot } from "./conversation";

const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env as ConfigurationBotFrameworkAuthenticationOptions);
const adapter = new CloudAdapter(botFrameworkAuthentication);

let conversationState: ConversationState;	
let userState: UserState;

const memoryStorage = new MemoryStorage();
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);

const onTurnErrorHandler = async (context: TurnContext, error: any) => {
  await context.sendTraceActivity(
    'OnTurnError Trace',	
    `${ error }`,	
    'https://www.botframework.com/schemas/error',	
    'TurnError'	
  );

  console.log(`\n [onTurnError] unhandled error: ${error}`);

  const traceActivity = {
    type: ActivityTypes.Trace,
    timestamp: new Date(),
    name: 'onTurnError Trace',
    label: 'TurnError',
    value: `${error}`,
    valueType: 'https://www.botframework.com/schemas/error'
  };
  await context.sendActivity(traceActivity);
  
  // Send a message to the user
  let onTurnErrorMessage = 'The bot encountered an error or bug.';
  await context.sendActivity(onTurnErrorMessage, onTurnErrorMessage, InputHints.ExpectingInput);
  onTurnErrorMessage = 'To continue to run this bot, please fix the bot source code.';
  await context.sendActivity(onTurnErrorMessage, onTurnErrorMessage, InputHints.ExpectingInput);
  
  // Clear out state
  await conversationState.delete(context);
};

adapter.onTurnError = onTurnErrorHandler;

/*	
adapter.use(new HandleActivityType(ActivityTypes.Message, async (context, next) => {	
  await context.sendActivity('Hello, middleware!');	
}));*/

let conversationReferences: ConversationReference = {};	
const conversationBot = new ConversationBot(conversationState, userState, conversationReferences);

export { adapter, conversationBot, botFrameworkAuthentication, onTurnErrorHandler };