import express from "express";
import { fbWebhookRouter, igWebhookRouter, waWebhookRouter } from "./webhooks";
import session from "express-session";
import RedisStore from "connect-redis";
import { redisClient } from "./core/redis";

const store = new RedisStore({ client: redisClient, prefix: "chatbot:" });

const customSession = session({
  secret: process.env.SESSION_TOKEN || "secret",
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false }
})

const app = express();
app.use('/whatsapp-incoming', waWebhookRouter);
app.use('/instagram-incoming', igWebhookRouter);
app.use('/facebook-incoming', fbWebhookRouter);
app.use(customSession);

export { app };