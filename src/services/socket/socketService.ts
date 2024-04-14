import { io } from "socket.io-client";

export const socketService = (credentials) => {
  const { url, auth } = credentials;
  
  const socketClient = io(url, {
    auth: auth,
    reconnection: true,
    reconnectionDelay: 5000,
    // reconnectionAttempts: 10,
  });
  
  return socketClient;
};