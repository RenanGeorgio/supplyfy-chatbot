import { config } from 'dotenv';
import * as path from 'path';

import {
  CloudAdapter,
  ConfigurationBotFrameworkAuthentication,
  ConfigurationBotFrameworkAuthenticationOptions,
  ConversationState,
  MemoryStorage,
  UserState,
  InputHints
} from 'botbuilder';
import { ConversationReference, ActivityTypes, TurnContext } from 'botbuilder-core';
import * as HandleActivityType from "@botbuildercommunity/middleware-activity-type";

import { ConversationBot } from './conversation';

const ENV_FILE = path.join(__dirname, '.env');
config({ path: ENV_FILE });

//const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env as ConfigurationBotFrameworkAuthenticationOptions);

const adapter = new CloudAdapter();

// Catch-all for errors.
const onTurnErrorHandler = async (context: TurnContext, error: any) => {
  console.error(`\n [onTurnError] unhandled error: ${ error }`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    'OnTurnError Trace',
    `${ error }`,
    'https://www.botframework.com/schemas/error',
    'TurnError'
  );

  // Send a message to the user
  let onTurnErrorMessage = 'The bot encountered an error or bug.';
  await context.sendActivity(onTurnErrorMessage, onTurnErrorMessage, InputHints.ExpectingInput);
  onTurnErrorMessage = 'To continue to run this bot, please fix the bot source code.';
  await context.sendActivity(onTurnErrorMessage, onTurnErrorMessage, InputHints.ExpectingInput);
  // Clear out state
  await conversationState.delete(context);
};

adapter.onTurnError = onTurnErrorHandler; // Set the onTurnError for the singleton CloudAdapter.

/*
adapter.use(new HandleActivityType(ActivityTypes.Message, async (context, next) => {
  await context.sendActivity('Hello, middleware!');
}));*/

let conversationState: ConversationState;
let userState: UserState;

// For local development, in-memory storage is used.
// CAUTION: The Memory Storage used here is for local bot debugging only. When the bot
// is restarted, anything stored in memory will be gone.
const memoryStorage = new MemoryStorage();

// Create conversation state with in-memory storage provider.
conversationState = new ConversationState(memoryStorage);
userState = new UserState(memoryStorage);

let conversationReferences: ConversationReference = {};
const conversationBot = new ConversationBot(conversationState, userState, conversationReferences);

export { conversationBot, adapter, onTurnErrorHandler }