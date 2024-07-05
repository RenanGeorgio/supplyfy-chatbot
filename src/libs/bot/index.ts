import { config } from 'dotenv';
import * as path from 'path';

import {
  CloudAdapter,
  ConfigurationBotFrameworkAuthentication,
  ConfigurationBotFrameworkAuthenticationOptions,
  ConversationState,
  MemoryStorage,
  UserState
} from 'botbuilder';
import { ConversationReference } from 'botbuilder-core';

import { ConversationBot } from './conversation';

const ENV_FILE = path.join(__dirname, '.env');
config({ path: ENV_FILE });

//const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env as ConfigurationBotFrameworkAuthenticationOptions);

const adapter = new CloudAdapter();

// Catch-all for errors.
const onTurnErrorHandler = async (context, error) => {
  console.error(`\n [onTurnError] unhandled error: ${ error }`);

  // Send a trace activity, which will be displayed in Bot Framework Emulator
  await context.sendTraceActivity(
    'OnTurnError Trace',
    `${ error }`,
    'https://www.botframework.com/schemas/error',
    'TurnError'
  );

  // Send a message to the user
  await context.sendActivity('The bot encounted an error or bug.');
  await context.sendActivity('To continue to run this bot, please fix the bot source code.');

  // Clear out state
  await conversationState.delete(context);
};

adapter.onTurnError = onTurnErrorHandler; // Set the onTurnError for the singleton CloudAdapter.

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