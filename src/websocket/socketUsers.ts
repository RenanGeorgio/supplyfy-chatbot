import { OnlineUser } from "../types";

export default {
  onlineUsers: [] as OnlineUser[],
  
  addNewUser({ userId, platform, socket }) {
    !this.onlineUsers.some((user) => {
      return user.userId === userId;
    }) &&
      this.onlineUsers.push({
        userId,
        socketId: socket.id,
        platform: platform || "web",
      });
  },

  removeUser(socket) {
    this.onlineUsers = this.onlineUsers.filter(
      (user) => user.socketId !== socket.id
    );
  },

  removeUserById(userId: string) {
    this.onlineUsers = this.onlineUsers.filter(
      (user) => user.userId !== userId
    );
  },
};
