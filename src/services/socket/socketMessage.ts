import type { Socket } from "socket.io-client";
import type { IMessage } from "../../types/types";
import { SocketEvents } from "../../websocket/enum";

export const emitMessageToCompany = async (
  socket: Socket,
  message: IMessage
) => {
  if (!socket || !message) {
    throw new Error("Uma instância do socket.io-client e mensagem são obrigatórios");
  }
  socket.emit(SocketEvents.SEND_MESSAGE, message);
};