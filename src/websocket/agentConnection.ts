import { AgentConnection } from "../types";

export default {
  agentsConnections: [] as AgentConnection[],
  
  addNewUser({ userId, companyId, platform, socket }) {
    !this.agentsConnections.some((user) => {
      return user.userId === userId;
    }) &&
      this.agentsConnections.push({
        userId,
        companyId,
        socketId: socket.id,
        platform: platform || "web",
      });
  },

  removeUser(socket) {
    this.agentsConnections = this.agentsConnections.filter(
      (user) => user.socketId !== socket.id
    );
  },

  removeUserById(userId: string) {
    this.agentsConnections = this.agentsConnections.filter(
      (user) => user.userId !== userId
    );
  },
};
