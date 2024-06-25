import { Router } from "express";
import { authMiddleware } from "../middlewares";

// server controller
import * as serverController from "../controllers/server/serverController";
/// legal controller
import * as dataController from "../controllers/com/dataController";
// meta server controller
import * as metaController from "../controllers/server/metaController";
// chat controller
import * as chatController from "../controllers/chat/chatController";
// auth controller
import * as authController from "../controllers/user/authController";
// Bot controller
import * as botController from "../controllers/bot/botController";
import * as botStatusController from "../controllers/bot/botStatusController";
import * as webhookController from "../controllers/webhook/webhookController";
import * as facebookController from "../controllers/meta/facebookController";

const routes = Router();

routes
  // server
  .get("/test", serverController.test)
  .get("/session", serverController.session)
  .get("/database", serverController.database)
  .post("/save-code", metaController.save)
  .post("/change-code", metaController.chageCode)
  .post("/change-wa-code", metaController.chageWhatsappCode)
  .post("/delete-data", dataController.disAllow)

  // login
  .get("/login", authController.login)

  // chat
  .post("/chat", authMiddleware.JWT, chatController.create)
  .get("/chat/:id", authMiddleware.JWT, chatController.list)
    
  .post("/bot", authMiddleware.JWT, botController.create)

  // controle do serviço dos bots
  .post("/bot/:serviceId/:action", authMiddleware.JWT, botStatusController.action)

  // webhook
  .post("/webhook", authMiddleware.JWT, webhookController.create)

  .get("/facebook/:userId", facebookController.verifyWebhook)
  .post("/facebook/:useId", facebookController.eventsHandler)

export default routes;