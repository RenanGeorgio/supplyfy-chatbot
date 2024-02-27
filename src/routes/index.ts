import { Router } from "express";

// server controller
import * as serverController from "../controllers/server/serverController"; 
// chat controller
import * as chatController from "../controllers/chat/chatController";
// whatsapp controller
import * as comController from "../controllers/com/whatsapp/whatsappController";

const routes = Router();

routes
    // Test-server
    .get("/test", serverController.test)

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

export default routes;