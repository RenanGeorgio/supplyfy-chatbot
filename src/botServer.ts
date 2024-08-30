import express, { Request, Response } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import RedisStore from "connect-redis";
import { redisClient } from "./core/redis";
import { CustomRequest } from "./types/types";
import { adapter } from "./libs/bot/adapter";
import { BotService } from "./libs/bot/init";
import { ContainerService } from "./libs/bot/container";

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


bot.post('/api/messages', async (req: Request, res: Response) => {
  const container = await ContainerService.getInstance()
  const conversationBot = container.getConversationBot()
  return await adapter.process(req, res, (context: any) => conversationBot.run(context));
});

export { bot };