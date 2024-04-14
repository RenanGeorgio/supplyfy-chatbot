import { findBot } from "../../helpers/findBot";
import { ISocketServiceController } from "../../types";
import { webhookTrigger } from "../webhook/webhookTrigger";
import { socketService } from "./socketService"

export const socketServiceController: ISocketServiceController = {
  sockets: [],
  // os dados do socket vão ficar dentro do modelo do bot
  start(credentials) {
    const id = credentials._id.toString();
    const socketInstance = findBot(id, this.sockets);

    if(socketInstance){
      return null;
    }

    const socket = socketService(credentials);

    socket.on("connect", () => {
      this.sockets.push({
        id: id,
        socket: socket,
      });
      console.log("Conectado ao socket server", socket.id)
    });
    
    socket.on("connect_error", (error) => {
      console.log("Sem conexão com o socket server");
    });
  },
}