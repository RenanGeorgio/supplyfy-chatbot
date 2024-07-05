import * as XMLHttpRequest from "xhr2";
import * as WebSocket from "ws";

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;

import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import "./database";
import { serverHttp, directLineService } from "./core/http";
import "./websocket";

const PORT = process.env.PORT ? process.env.PORT.replace(/[\\"]/g, '') : 8000;
const HOST = process.env.HOST ? process.env.HOST.replace(/[\\"]/g, '') : "http://localhost";

serverHttp.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});

directLineService.subscribeBot("bot");

import "./services";