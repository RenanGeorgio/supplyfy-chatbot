import { io } from "../core/http";
import { authMiddleware } from "../middlewares";
import socketUsers from "./socketUsers";
import { OnlineUser } from "../types";
import { Platforms } from "../types/enums";
import { SocketEvents } from "./enum";


io.on(SocketEvents.CONNECTION, (socket) => {
  socket.on(
    SocketEvents.ADD_NEW_USER,
    ({ userId, platform }: { userId: string; platform: Platforms }) => {
      socketUsers.addNewUser({ userId, platform, socket });
      io.emit(SocketEvents.ONLINE_USERS, socketUsers.onlineUsers);
      console.log(SocketEvents.ONLINE_USERS, socketUsers.onlineUsers);
    }
  );

  socket.on(SocketEvents.SEND_MESSAGE, (message: any) => {
    const receiver = socketUsers.onlineUsers.find(
      (user: any) => user.userId === message.recipientId
       // user.platform === message.platform // acrescentar plataforma na msg
    );
    if (receiver) {
      io.to(receiver.socketId).emit(SocketEvents.GET_MESSAGE, message);
    }
  });

  socket.on(SocketEvents.DISCONNECT, () => {
    socketUsers.removeUser(socket);
    io.emit(SocketEvents.ONLINE_USERS, socketUsers.onlineUsers);
  });

  socket.on(SocketEvents.NEW_CLIENT_CHAT, (data: any) => {
    io.emit(SocketEvents.NEW_USER_CHAT, data);
  });

  socket.on(SocketEvents.DISCONNECT_CLIENT, (userId: string) => {
    socketUsers.removeUserById(userId);
    io.emit(SocketEvents.ONLINE_USERS, socketUsers.onlineUsers);
  });
});