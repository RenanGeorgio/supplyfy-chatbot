import { Router } from "express";
import { authMiddleware } from "../middlewares";

// server controller
import * as serverController from "../controllers/server/serverController";
import * as userController from "../controllers/user/userController";
// chat controller
import * as chatController from "../controllers/chat/chatController";
// auth controller
import * as authController from "../controllers/user/authController";
// Bot controller
import * as botController from "../controllers/bot/botController";
import * as botStatusController from "../controllers/bot/botStatusController";
import * as webhookController from "../controllers/webhook/webhookController";
import * as facebookController from "../controllers/meta/facebookController";
import * as anonymousChatController from "../controllers/chat/anonymousChatController";
import * as chatClientController from "../controllers/chat/chatClientController";
import * as messageController from "../controllers/chat/messageController";
import * as apiTokenController from "../controllers/api/apiTokenController";
import * as auth0Controller from "../controllers/user/auth0Controller";

const routes = Router();

routes
  // Test-server
  .get("/test", serverController.test)
  .get("/session", serverController.session)
  .get("/database", serverController.database)

  // login
  .post("/login", authController.login)

  // chat
  // .post("/chat", chatController.create)
  // .get("/chat/:id", authMiddleware.JWT, chatController.list)

  // // whatsapp plugin
  // .post("/whatsapp/set-status", whatsappController.markMessageAsRead)
  // .post("/whatsapp/send-msg", whatsappController.sendTextMessage)
  // .post("/whatsapp/inte-btn", whatsappController.sendButtonsMessage)
  // .post("/whatsapp/send-contact", whatsappController.sendContacts)
  // .post("/whatsapp/inte-list", whatsappController.sendRadioButtons)
  // .post("/whatsapp/send-img", whatsappController.sendImageByLink)
  // .post("/whatsapp/upload", whatsappController.uploadMedia)
  // .post("/whatsapp/send-doc", whatsappController.sendDocumentMessage)
  // user
  .get("/user", authMiddleware.JWT, userController.info)

  .post("/bot", authMiddleware.JWT, botController.create)

  // controle do serviço dos bots
  .post(
    "/bot/:serviceId/:action",
    authMiddleware.JWT,
    botStatusController.action
  )

  .get("/facebook/:userId", facebookController.verifyWebhook)
  .post("/facebook/:useId", facebookController.eventsHandler)

  // chat anonimo
  .post("/chat/send-message", anonymousChatController.create)

  // ----- Chat -----
  // Copiado do ignai-server
  // to-do: add middleware de auth novamente
  // cria um cliente do chat
  .post("/chat/client", chatClientController.createClient)
  // lista todos os clientes
  .get("/chat/clients", chatClientController.listClients)
  // busca um cliente
  .get("/chat/client/email/:email", chatClientController.findClientByEmail)
  // busca um cliente
  .get("/chat/client/:_id", chatClientController.findClientById)
  // // Busca um chat
  .get("/chat/find/:firstId/:secondId", chatController.findChat)
  // Cria um chat
  .post("/chat", chatController.createChat)
  // ----- Mensagens -----
  // // Lista todas as mensagens de um chat
  .get("/chat/message/:chatId", authMiddleware.JWT, messageController.list)
  // envia message via requisição http
  .post(
    "/chat/message/send-message",
    authMiddleware.apiMiddleware,
    messageController.sendMessage
  )
  // Cria uma mensagem (sumente armazena)
  .post("/chat/message", authMiddleware.JWT, messageController.create)
  // // Lista todos os chats de um usuário
  .get("/chat/:userId", authMiddleware.JWT, chatController.findUserChats)
  // gerar api token
  .post("/api-token", authMiddleware.JWT, apiTokenController.create)
  // webhook
  .post("/webhook", authMiddleware.apiMiddleware, webhookController.create)

  // ----- Auth0 -----
  .post("/auth0/auth", auth0Controller.token)
  .post("/auth0/register", authMiddleware.auth0, auth0Controller.register)
  .post("/auth0/login", authMiddleware.auth0, auth0Controller.login)

export default routes;
