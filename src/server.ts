import express from "express";
import { fbWebhookRouter, igWebhookRouter, waWebhookRouter } from "./webhooks";

const app = express();

app.use('/whatsapp-incoming', waWebhookRouter);
app.use('/instagram-incoming', igWebhookRouter);
app.use('/facebook-incoming', fbWebhookRouter);

export { app };