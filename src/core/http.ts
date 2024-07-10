import http from "http";
import { INodeSocket } from "botframework-streaming";
import { Server } from "socket.io";
import { CloudAdapter } from "botbuilder";
import { conversationBot, adapter, botFrameworkAuthentication, onTurnErrorHandler } from "../lib/bot";
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
  //await adapter.process(req, socket as unknown as INodeSocket, head, (context) => conversationBot.run(context));
});

// Listen for incoming notifications and send proactive messages to users.
/*botServer.get('/api/notify', async (req, res) => {
  for (const conversationReference of Object.values(userState)) {
      await adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async (context) => {
          await context.sendActivity('proactive hello');
      });
  }
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.write('<html><body><h1>Proactive messages have been sent.</h1></body></html>');
  res.end();
});*/

// Listen for incoming custom notifications and send proactive messages to users.
/*botServer.post('/api/notify', async (req, res) => {
  for (const msg of req.body) {
      for (const conversationReference of Object.values(userState)) {
          await adapter.continueConversationAsync(process.env.MicrosoftAppId, conversationReference, async (turnContext) => {
              await turnContext.sendActivity(msg);
          });
      }
  }
  res.setHeader('Content-Type', 'text/html');
  res.writeHead(200);
  res.write('Proactive messages have been sent.');
  res.end();
});*/

export { httpServer, botServer, io };