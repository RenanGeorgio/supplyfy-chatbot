import { Router } from "express";
import middlewares from "../middlewares";

// server controller
import * as serverController from "../controllers/server/serverController"; 
// chat controller
import * as chatController from "../controllers/chat/chatController";
// whatsapp controller
import * as metaWebhookController from "../controllers/com/whatsapp/webhookController";
import * as comController from "../controllers/com/whatsapp/comController";
// facebook controller
import * as facebook from '../services/facebook';

const routes = Router();

routes
    // Test-server
    .get("/test", serverController.test)

    // Meta webhook
    .get("/webhook", metaWebhookController.subscribeToWb)
    .post("/webhook", metaWebhookController.incomingWb)

    // chat
    .post("/chat", chatController.create)    
    .get("/chat/:id", chatController.list)

    // whatsapp plugin
    .post("/whatsapp/set-status", comController.markMessageAsRead)
    .post("/whatsapp/send-msg", comController.sendTextMessage)
    .post("/whatsapp/inte-btn", comController.sendButtonsMessage)
    .post("/whatsapp/send-contact", comController.sendContacts)
    .post("/whatsapp/inte-list", comController.sendRadioButtons)
    .post("/whatsapp/send-img", comController.sendImageByLink)
    .post("/whatsapp/upload", comController.uploadMedia)
    .post("/whatsapp/send-doc", comController.sendDocumentMessage)

    // facebook plugin
    .post("/messenger", facebook.events)

export default routes;