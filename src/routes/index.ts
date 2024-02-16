import { Router } from 'express';
import middlewares from '../middlewares';

import * as serverController from '../controllers/server/serverController'; 
import * as chatController from '../controllers/chat/chatController';


const routes = Router();

routes
    // Test-server
    .get("/test", serverController.test)

    // chat test
    .post("/chat", chatController.message);


export default routes;