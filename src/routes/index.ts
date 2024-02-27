import { Router } from "express";
import { authMiddleware  } from "../middlewares";

// server controller
import * as serverController from "../controllers/server/serverController"; 
// chat controller
import * as chatController from "../controllers/chat/chatController";
// whatsapp controller
import * as whatsappController from "../controllers/com/whatsapp/whatsappController";

const routes = Router();

routes
  // Test-server
  .get("/test", serverController.test)

  // chat
  .post("/chat", authMiddleware.JWT, chatController.create)
  .get("/chat/:id", authMiddleware.JWT, chatController.list)

  // whatsapp plugin
  .post("/whatsapp/set-status", whatsappController.markMessageAsRead)
  .post("/whatsapp/send-msg", whatsappController.sendTextMessage)
  .post("/whatsapp/inte-btn", whatsappController.sendButtonsMessage)
  .post("/whatsapp/send-contact", whatsappController.sendContacts)
  .post("/whatsapp/inte-list", whatsappController.sendRadioButtons)
  .post("/whatsapp/send-img", whatsappController.sendImageByLink)
  .post("/whatsapp/upload", whatsappController.uploadMedia)
  .post("/whatsapp/send-doc", whatsappController.sendDocumentMessage);

export default routes;