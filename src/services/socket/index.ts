import { socketService } from "./socketService";
import { webhookTrigger } from "../../webhooks/custom/webhookTrigger";
import { findBot } from "../../helpers/findBot";
import { ISocketServiceController } from "../../types";
import { Events } from "../../types/enums";


export const socketServiceController: ISocketServiceController = {
  sockets: [],
  // os dados do socket vão ficar dentro do modelo do bot
  start(credentials, webhook) {
    const id = credentials._id.toString();
    const socketInstance = findBot(id, this.sockets);

    if (socketInstance) {
      return socketInstance.socket;
    }

    const socket = socketService(credentials);

    socket.on("connect", () => {
      this.sockets.push({
        id: id,
        socket: socket,
      });
      
      console.log(`📗 Socket conectado: ${credentials.url}`);
      if (webhook) {
        webhookTrigger({
          url: webhook.url,
          event: Events.SERVICE_CONNECTED,
          message: "socket conectado",
          service: "socket",
        });
      }
    });

    socket.on("connect_error", (error) => {
      console.log("Sem conexão com o socket server");
      if (webhook) {
        webhookTrigger({
          url: webhook.url,
          event: Events.SERVICE_DISCONNECTED,
          message: "socket desconectado",
          service: "socket",
        });
      }
    });
    
    return socket;
  },
};