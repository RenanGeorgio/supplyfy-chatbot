import http from "http";
import { INodeSocket } from "botframework-streaming";
import { Server } from "socket.io";
import { CloudAdapter } from "botbuilder";
import { conversationBot, botFrameworkAuthentication, onTurnErrorHandler } from "../lib/bot";
import app from "../server";
import bot from "../botServer";

const httpServer = http.createServer(app);
const botServer = http.createServer(bot);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

botServer.on('upgrade', async (req, socket, head) => {
  // Create an adapter scoped to this WebSocket connection to allow storing session data.
  const streamingAdapter = new CloudAdapter(botFrameworkAuthentication);

  // Set onTurnError for the CloudAdapter created for each connection.
  streamingAdapter.onTurnError = onTurnErrorHandler;

  await streamingAdapter.process(req, socket as unknown as INodeSocket, head, (context) => conversationBot.run(context));
});

export { httpServer, botServer, io };