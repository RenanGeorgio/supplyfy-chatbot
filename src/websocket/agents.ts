import { io } from "socket.io-client";
import { bot_io } from "../core/http";
import agentsConnection from "./agentConnection";
import { Platforms } from "../types/enums";


const clientSockets = new Map();

bot_io.on('connection', (socket) => {
  const clientId = socket.id;

  const agentSocket = io('http://localhost:8000', { path: '/ws' });
  clientSockets.set(clientId, agentSocket);

  socket.on(
    'addNewUser',
    ({ userId, companyId, platform }: { userId: string; companyId: string; platform: Platforms }) => {
      agentsConnection.addNewUser({ userId, companyId, platform, socket });
    }
  );

  // ACHO QUE NAO É NECESSARIO - VERIFICAR E APAGAR
  socket.on('message', (message) => {
    agentSocket.emit('message', message); // Forward to FastAPI server
  });

  socket.on('disconnect', () => {
    agentsConnection.removeUser(socket);
    clientSockets.delete(clientId);
  });
});