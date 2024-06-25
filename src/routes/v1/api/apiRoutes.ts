import { Router } from "express";
import { authMiddleware } from "../../../middlewares";
import * as chatClientController from "../../../controllers/chat/chatClientController";
import * as chatController from "../../../controllers/chat/chatController";
import * as messageController from "../../../controllers/chat/messageController";
import * as webhookController from "../../../controllers/webhook/webhookController";

const apiRoutes = Router();

apiRoutes
  .post(
    "/chat/client",
    authMiddleware.apiMiddleware,
    chatClientController.createClient
  )
  // lista todos os clientes
  .get(
    "/chat/clients",
    authMiddleware.apiMiddleware,
    chatClientController.listClients
  )
  // busca um cliente
  .get(
    "/chat/client/:_id",
    authMiddleware.apiMiddleware,
    chatClientController.findClientById
  )
  // atualiza um cliente do chat
  .put(
    "/chat/client/:_id",
    authMiddleware.apiMiddleware,
    chatClientController.updateClient
  )
  // Cria um chat
  .post("/chat", authMiddleware.apiMiddleware, chatController.createChat)
  // cadastra webhook
  .post(
    "/chat/message/send-message",
    authMiddleware.apiMiddleware,
    messageController.sendMessage
  )
  // webhook
  .post("/webhook", authMiddleware.apiMiddleware, webhookController.create);

export default apiRoutes;
