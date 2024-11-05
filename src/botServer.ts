import express, { Request, Response } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import RedisStore from "connect-redis";

import { redisClient } from "./core/redis";
import { adapter } from "./libs/bot/adapter";
import { ContainerService } from "./libs/bot/container";
import { CustomRequest } from "./types/types";


const store = new RedisStore({ client: redisClient, prefix: "bot:" });

const customSession = session({
  secret: process.env.SESSION_TOKEN ? process.env.SESSION_TOKEN.replace(/[\\"]/g, '') : "secret",
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false }
})

const bot = express();

bot.use(cors());

bot.use(
  bodyParser.json({
    verify: function (req: CustomRequest, res: Response, buf: Buffer) {
      req.rawBody = buf;
    }
  })
);

bot.use(bodyParser.urlencoded({ extended: false }));

bot.use(express.json());

bot.use(express.urlencoded({ extended: true }));

bot.use(cookieParser());

bot.use(customSession);

const containerPromise = ContainerService.getInstance();
const conversationBot = containerPromise.then((container) => { return container.getConversationBot() })

bot.post('/api/messages', async (req: Request, res: Response) => {
  return await adapter.process(req, res, async (context: any) => (await conversationBot).run(context));
});

// Listen for incoming notifications and send proactive messages to users.
/*bot.get('/api/notify', async (req: Request, res: Response) => {
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
/*bot.post('/api/notify', async (req: Request, res: Response) => {
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

export { bot, conversationBot };
