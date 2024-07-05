import * as XMLHttpRequest from "xhr2";
import * as WebSocket from "ws";

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = WebSocket;

import "express-async-errors";
import * as path from "path";
import * as dotenv from "dotenv";
//const ENV_FILE = path.join(__dirname, '.env');
//dotenv.config({ path: ENV_FILE });
dotenv.config();

import { CloudAdapter } from "botbuilder";
import { INodeSocket } from "botframework-streaming";

import "./database";
import { serverHttp, directLineService, botServer } from "./core/http";
import { onTurnErrorHandler } from "./placeholder";
import "./websocket";

const PORT = process.env.PORT ? process.env.PORT.replace(/[\\"]/g, '') : 8000;
const HOST = process.env.HOST ? process.env.HOST.replace(/[\\"]/g, '') : "http://localhost";

serverHttp.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});

directLineService.subscribeBot("bot");

import "./services";