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
const bot = new ConversationBot(conversationState, userState, conversationReferences);

// Listen for incoming requests.
server.post('/api/messages', async (req, res) => {
  // Route received a request to adapter for processing
  await adapter.process(req, res, (context) => bot.run(context));
});

// Listen for incoming notifications and send proactive messages to users.
/*server.get('/api/notify', async (req, res) => {
  for (const conversationReference of Object.values(userState)) {
      await adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async (context) => {
          await context.sendActivity('proactive hello');
      });
  }
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.write('<html><body><h1>Proactive messages have been sent.</h1></body></html>');
  res.end();
});*/

// Listen for incoming custom notifications and send proactive messages to users.
/*server.post('/api/notify', async (req, res) => {
  for (const msg of req.body) {
      for (const conversationReference of Object.values(userState)) {
          await adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async (turnContext) => {
              await turnContext.sendActivity(msg);
          });
      }
  }
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.write('Proactive messages have been sent.');
  res.end();
});*/









/**
 * Lets a user communicate with a bot from a console window.
 *
 * @remarks
 * The following example shows the typical adapter setup:
 *
 *
 * ```JavaScript
 * const { ConsoleAdapter } = require('botbuilder');
 *
 * const adapter = new ConsoleAdapter();
 * const closeFn = adapter.listen(async (context) => {
 *    await context.sendActivity(`Hello World`);
 * });
 * ```
 */
export class ConsoleAdapter extends BotAdapter {
    private nextId: number = 0;
    private readonly reference: ConversationReference;

    constructor(reference?: ConversationReference) {
        super();
        this.reference = {
            bot: { id: 'bot', name: 'Bot' },
            channelId: 'console',
            conversation: { id: 'convo1', name: '', isGroup: false },
            serviceUrl: '',
            user: { id: 'user', name: 'User1' },
            ...reference
        } as ConversationReference;
    }

    /**
     * Begins listening to console input. A function will be returned that can be used to stop the
     * bot listening and therefore end the process.
     *
     * @remarks
     * Upon receiving input from the console the flow is as follows:
     *
     * - An 'message' activity will be created containing the users input text.
     * - A revokable `TurnContext` will be created for the activity.
     * - The context will be routed through any middleware registered with [use()](#use).
     * - The bots logic handler that was passed in will be executed.
     * - The promise chain setup by the middleware stack will be resolved.
     * - The context object will be revoked and any future calls to its members will result in a
     *   `TypeError` being thrown.
     *
     * ```JavaScript
     * const closeFn = adapter.listen(async (context) => {
     *    const utterance = context.activity.text.toLowerCase();
     *    if (utterance.includes('goodbye')) {
     *       await context.sendActivity(`Ok... Goodbye`);
     *       closeFn();
     *    } else {
     *       await context.sendActivity(`Hello World`);
     *    }
     * });
     * ```
     * @param logic Function which will be called each time a message is input by the user.
     */
    public listen(logic: (context: TurnContext) => Promise<void>): () => void {
        const rl: readline.ReadLine = this.createInterface({ input: process.stdin, output: process.stdout, terminal: false });
        rl.on('line', (line: string) => {
            // Initialize activity
            const activity: Partial<Activity> = TurnContext.applyConversationReference(
                {
                    id: (this.nextId++).toString(),
                    text: line,
                    timestamp: new Date(),
                    type: ActivityTypes.Message
                },
                this.reference,
                true
            );

            // Create context and run middleware pipe
            const context: TurnContext = new TurnContext(this, activity);
            this.runMiddleware(context, logic)
                .catch((err: Error) => { this.printError(err.toString()); });
        });

        return (): void => {
            rl.close();
        };
    }

    /**
     * Lets a bot proactively message the user.
     *
     * @remarks
     * The processing steps for this method are very similar to [listen()](#listen)
     * in that a `TurnContext` will be created which is then routed through the adapters middleware
     * before calling the passed in logic handler. The key difference being that since an activity
     * wasn't actually received it has to be created.  The created activity will have its address
     * related fields populated but will have a `context.activity.type === undefined`.
     *
     * ```JavaScript
     * function delayedNotify(context, message, delay) {
     *    const reference = TurnContext.getConversationReference(context.activity);
     *    setTimeout(() => {
     *       adapter.continueConversation(reference, async (ctx) => {
     *          await ctx.sendActivity(message);
     *       });
     *    }, delay);
     * }
     * ```
     * @param reference A `ConversationReference` saved during a previous message from a user.  This can be calculated for any incoming activity using `TurnContext.getConversationReference(context.activity)`.
     * @param logic A function handler that will be called to perform the bots logic after the the adapters middleware has been run.
     */
    public continueConversation(reference: ConversationReference, logic: (context: TurnContext) => Promise<void>): Promise<void> {
        // Create context and run middleware pipe
        const activity: Partial<Activity> = TurnContext.applyConversationReference({}, reference, true);
        const context: TurnContext = new TurnContext(this, activity);

        return this.runMiddleware(context, logic)
            .catch((err: Error) => { this.printError(err.toString()); });
    }

    /**
     * Logs a set of activities to the console.
     *
     * @remarks
     * Calling `TurnContext.sendActivities()` or `TurnContext.sendActivity()` is the preferred way of
     * sending activities as that will ensure that outgoing activities have been properly addressed
     * and that any interested middleware has been notified.
     * @param context Context for the current turn of conversation with the user.
     * @param activities List of activities to send.
     */
    public async sendActivities(context: TurnContext, activities: Array <Partial<Activity>>): Promise<ResourceResponse[]> {
        const responses: ResourceResponse[] = [];
        for (const activity of activities) {
            responses.push({} as ResourceResponse);

            switch (activity.type) {
            case 'delay' as ActivityTypes:
                await this.sleep(activity.value);
                break;
            case ActivityTypes.Message:
                if (activity.attachments && activity.attachments.length > 0) {
                    const append: string = activity.attachments.length === 1
                        ? '(1 attachment)'
                        : `(${ activity.attachments.length } attachments)`;
                    this.print(`${ activity.text } ${ append }`);
                } else {
                    this.print(activity.text || '');
                }
                break;
            default:
                this.print(`[${ activity.type }]`);
                break;
            }
        }
        return responses;
    }

    /**
     * Not supported for the ConsoleAdapter.  Calling this method or `TurnContext.updateActivity()`
     * will result an error being returned.
     */
    public updateActivity(context: TurnContext, activity: Partial<Activity>): Promise<void> {
        return Promise.reject(new Error('ConsoleAdapter.updateActivity(): not supported.'));
    }

    /**
     * Not supported for the ConsoleAdapter.  Calling this method or `TurnContext.deleteActivity()`
     * will result an error being returned.
     */
    public deleteActivity(context: TurnContext, reference: Partial<ConversationReference>): Promise<void> {
        return Promise.reject(new Error('ConsoleAdapter.deleteActivity(): not supported.'));
    }

    /**
     * Logs text to the console.
     * @param line Text to print.
     */
    protected print(line: string): void {
        console.log(line);
    }

    /**
     * Logs an error to the console.
     * @param line Error text to print.
     */
    protected printError(line: string): void {
        console.error(line);
    }

    private sleep(milliseconds: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
}