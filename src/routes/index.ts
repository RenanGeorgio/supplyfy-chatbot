import { Router } from 'express';
import middlewares from '../middlewares';

import * as serverController from '../controllers/server/serverController'; 
import * as chatController from '../controllers/chat/chatController';
import * as facebook from '../services/facebook';

const routes = Router();

routes
    // Test-server
    .get("/test", serverController.test)

    // chat test
    .post("/chat", chatController.create)    
    .get("/chat/:id", chatController.list)
    
    .post("/messenger", facebook.events)
    .get("/messenger", facebook.webhook)


export default routes;