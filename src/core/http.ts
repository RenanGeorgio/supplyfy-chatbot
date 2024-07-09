import http from "http";
import { INodeSocket } from "botframework-streaming";
import { conversationBot, adapter } from "../lib/bot";
import app from "../server";
import bot from "../botServer";
import { Server } from "socket.io";

const httpServer = http.createServer(app);
const botServer = http.createServer(bot);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

botServer.on('upgrade', async (req, socket, head) => {
  await adapter.process(req, socket as unknown as INodeSocket, head, (context) => conversationBot.run(context));
});

export { httpServer, botServer, io };