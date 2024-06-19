import { io } from "../core/http";
import { authMiddleware } from "../middlewares";
import { OnlineUser } from "../types";
import { Platforms } from "../types/enums";
import socketUsers from "./socketUsers";
// let onlineUsers: OnlineUser[] = [];

io.on("connection", (socket) => {
  socket.on(
    "addNewUser",
    ({ userId, platform }: { userId: string; platform: Platforms }) => {
      // console.log("addNewUser 123", socket.id, userId, platform);
      socketUsers.addNewUser({ userId, platform, socket });
      io.emit("onlineUsers", socketUsers.onlineUsers);
      console.log("onlineUsers", socketUsers.onlineUsers);
    }
  );

  socket.on("sendMessage", (message: any) => {
    // console.log("messagem recebida: ", message);
    const receiver = socketUsers.onlineUsers.find(
      (user: any) => user.userId === message.recipientId
      // user.platform === message.platform // acrescentar plataforma na msg
    );
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    socketUsers.removeUser(socket);
    io.emit("onlineUsers", socketUsers.onlineUsers);
  });

  socket.on("newClientChat", (data: any) => {
    // avisar o front que um novo chat foi criado
    io.emit("newUserChat", data);
  });

  socket.on("disconnectClient", (userId: string) => {
    socketUsers.removeUserById(userId);
    io.emit("onlineUsers", socketUsers.onlineUsers);
  });
});
