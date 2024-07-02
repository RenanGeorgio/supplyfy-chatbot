import { config } from 'dotenv';
import * as path from 'path';
import * as restify from 'restify';
import { INodeSocket } from 'botframework-streaming';

import {
    CloudAdapter,
    ConfigurationBotFrameworkAuthentication,
    ConfigurationBotFrameworkAuthenticationOptions,
    ConversationState,
    MemoryStorage,
    UserState
} from 'botbuilder';

// This bot's main dialog.
import { WelcomeBot } from './bot';

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

// Create the main dialog.
const myBot = new WelcomeBot(userState);
const bot = new DialogBot(conversationState, userState, myBot);
const storeBot = new StateManagementBot(conversationState, userState);

// Create HTTP server.
const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\n${ server.name } listening to ${ server.url }`);
});

// Listen for incoming requests.
server.post('/api/messages', async (req, res) => {
  // Route received a request to adapter for processing
  await adapter.process(req, res, (context) => myBot.run(context));
});

// Listen for Upgrade requests for Streaming.
server.on('upgrade', async (req, socket, head) => {
  // Create an adapter scoped to this WebSocket connection to allow storing session data.
  const streamingAdapter = new CloudAdapter();

  // Set onTurnError for the CloudAdapter created for each connection.
  streamingAdapter.onTurnError = onTurnErrorHandler;

  await streamingAdapter.process(req, socket as unknown as INodeSocket, head, (context) => myBot.run(context));
});