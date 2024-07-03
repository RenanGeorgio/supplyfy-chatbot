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
import { serverHttp, directLineService } from "./core/http";
import { onTurnErrorHandler } from "./placeholder";
import "./websocket";

const PORT = process.env.PORT ? process.env.PORT.replace(/[\\"]/g, '') : 8000;
const HOST = process.env.HOST ? process.env.HOST.replace(/[\\"]/g, '') : "http://localhost";

serverHttp.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});

directLineService.subscribeBot("bot");

// Listen for Upgrade requests for Streaming.
serverHttp.on('upgrade', async (req, socket, head) => {
    // Create an adapter scoped to this WebSocket connection to allow storing session data.
    const streamingAdapter = new CloudAdapter();
  
    // Set onTurnError for the CloudAdapter created for each connection.
    streamingAdapter.onTurnError = onTurnErrorHandler;
  
    await streamingAdapter.process(req, socket as unknown as INodeSocket, head, (context) => bot.run(context));
});

import "./services";