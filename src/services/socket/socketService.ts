import { io } from "socket.io-client";
import { ISocketCredentials } from "../../types/types";

export const socketService = (credentials: ISocketCredentials) => {
  const { url, auth } = credentials;
  
  const socketClient = io(url, {
    auth: auth,
    reconnection: true,
    reconnectionDelay: 5000,
    // reconnectionAttempts: 10,
  });
  
  return socketClient;
};