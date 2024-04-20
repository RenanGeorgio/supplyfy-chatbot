import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import "./database";
import { serverHttp } from "./core/http";
//import "./websocket";

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "http://localhost";

serverHttp.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});

import "./services";
