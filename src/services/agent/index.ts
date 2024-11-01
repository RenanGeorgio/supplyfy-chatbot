import { agentSocketService } from "./agentSocketService";
import { ISocketServiceController } from "../../types";


export const agentServiceController: ISocketServiceController = {
  sockets: [],
  // os dados do socket vão ficar dentro do modelo do bot
  start(credentials) {
    const id = credentials._id.toString();

    const socket = agentSocketService(credentials);

    socket.on("connect", () => {
      this.sockets.push({
        id: id,
        socket: socket,
      });
      
      console.log(`📗 Socket conectado: ${credentials.url}`);
    });

    socket.on("connect_error", (error: any) => {
      console.log("Sem conexão com o socket server");
    });
    
    return socket;
  },
};