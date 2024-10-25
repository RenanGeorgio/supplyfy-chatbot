import { XMLHttpRequest } from "xhr2";
import ws from "ws";

global.XMLHttpRequest = XMLHttpRequest;
global.WebSocket = ws;

import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import "./database";
import { httpServer, botServer } from "./core/http";
import "./websocket";

const BOT_PORT = process.env.BOT_PORT ? process.env.BOT_PORT.replace(/[\\"]/g, '') : 8001;
const BOT_HOST = process.env.BOT_HOST ? process.env.BOT_HOST.replace(/[\\"]/g, '') : "http://localhost";

botServer.listen(BOT_PORT, () => {
    console.log(`Bot Server running on ${BOT_HOST}:${BOT_PORT}`);
});

const PORT = process.env.PORT ? process.env.PORT.replace(/[\\"]/g, '') : 8000;
const HOST = process.env.HOST ? process.env.HOST.replace(/[\\"]/g, '') : "http://localhost";

httpServer.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});

import "./services";