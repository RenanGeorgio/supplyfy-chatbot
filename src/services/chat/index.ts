import { io } from "../../";
// import { OnlineUser } from "../../types/types";

const ChatService = () => {
  let onlineUsers: any[] = [];

  io.on("connection", (socket) => {
    socket.on("clientConnected", (userId: string) => {
      !onlineUsers.some((user: any) => user.userId === userId) &&
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
      io.emit("addNewUser", onlineUsers);
      console.log(onlineUsers);
    });
  });
};

export default ChatService;
