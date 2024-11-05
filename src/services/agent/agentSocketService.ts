import { io } from "socket.io-client";
import { ISocketCredentials } from "../../types/types";


export const agentSocketService = (credentials: ISocketCredentials) => {
  const { url, auth } = credentials;
  
  const agentClient = io(url, {
    auth: auth,
    reconnection: true,
    reconnectionDelay: 5000,
  });
  
  return agentClient;
};