import { Router } from "express";
import * as controller from "./controllers/database";

const routes = Router();

routes
    .get("/test", controller.test)


export default routes;