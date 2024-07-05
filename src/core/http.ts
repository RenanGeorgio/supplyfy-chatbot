import http from "http";
import { Server } from "socket.io";
import { app, bot } from "../server";
import { DirectlineServiceV2 as DirectlineService } from "../libs/bot/connector";

const serverHttp = http.createServer(app);
const botServer = http.createServer(bot);

const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});

botServer.post('/api/messages', async (req, res) => {
  await adapter.process(req, res, (context) => myBot.run(context));
});

// Listen for Upgrade requests for Streaming.
botServer.on('upgrade', async (req, socket, head) => {
  // Create an adapter scoped to this WebSocket connection to allow storing session data.
  const streamingAdapter = new CloudAdapter();

  // Set onTurnError for the CloudAdapter created for each connection.
  streamingAdapter.onTurnError = onTurnErrorHandler;

  await streamingAdapter.process(req, socket as unknown as INodeSocket, head, (context) => bot.run(context));
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

const directLineService = new DirectlineService();

export { serverHttp, io, directLineService, botServer };