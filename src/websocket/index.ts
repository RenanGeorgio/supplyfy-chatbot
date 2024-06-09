import { io } from "../core/http";
import { authMiddleware } from "../middlewares";
import { OnlineUser } from "../types";
import { Platforms } from "../types/enums";

let onlineUsers: OnlineUser[] = [];

io.on("connection", (socket) => {
  socket.on(
    "addNewUser",
    ({ userId, platform }: { userId: string; platform: Platforms }) => {
      // console.log("addNewUser 123", socket.id, userId, platform);
      !onlineUsers.some((user: any) => {
        return user.userId === userId;
      }) &&
        onlineUsers.push({
          userId,
          socketId: socket.id,
          platform: platform || "web", // acrescentar plataforma pra filtrar
        });

      io.emit("onlineUsers", onlineUsers);
      console.log("onlineUsers", onlineUsers);
    }
  );

  socket.on("sendMessage", (message: any) => {
    console.log("messagem recebida: ", message);
    const receiver = onlineUsers.find(
      (user: any) => user.userId === message.recipientId
      // user.platform === message.platform // acrescentar plataforma na msg
    );

    if (receiver) {
      console.log(receiver, "receiver");
      io.to(receiver.socketId).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(
      (user: any) => user.socketId !== socket.id
    );
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("newClientChat", (data: any) => {
    // avisar o front que um novo chat foi criado
    io.emit("newUserChat", data);
  });
});
