import { io } from "socket.io-client";
import { bot_io } from "../core/http";
import agentsConnection from "./agentConnection";
import { Platforms } from "../types/enums";


const clientSockets = new Map(); // Store FastAPI connections by client ID

bot_io.on('connection', (socket) => {
  const clientId = socket.id;

  const agentSocket = io('http://localhost:8000', { path: '/ws' }); // Update if FastAPI path or URL differs
  clientSockets.set(clientId, agentSocket);

  socket.on(
    "addNewUser",
    ({ userId, companyId, platform }: { userId: string; companyId: string; platform: Platforms }) => {
      agentsConnection.addNewUser({ userId, companyId, platform, socket });
    }
  );

  // Handle messages from the client and send to the FastAPI server
  socket.on('message', (message) => {
    console.log(`Received from client ${clientId}:`, message);
    agentSocket.emit('message', message); // Forward to FastAPI server
  });

  socket.on('disconnect', () => {
    console.log(`Client ${clientId} disconnected`);
    agentsConnection.removeUser(socket);
    clientSockets.delete(clientId);
  });
});