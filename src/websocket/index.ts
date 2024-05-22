import { io } from "../core/http";
import { authMiddleware } from "../middlewares";
import { OnlineUser } from "../types";

let onlineUsers: OnlineUser[] = [];
io.on("connection", (socket) => {
  // console.log(socket)
  console.log("connected " + socket.id);
  socket.on("addNewUser", (userId: string) => {
    console.log("addNewUser 123", socket)
    console.log("addNewUser 123", userId)
    !onlineUsers.some((user: any) => user.userId === userId) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
   
    io.emit("onlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message: any) => {
    console.log("messagem recebida: ", message)
    const receiver = onlineUsers.find(
      (user: any) => user.userId === message.recipientId
    );
   
    if (receiver) {
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