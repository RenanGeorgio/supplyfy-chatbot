import http from "http";
import { app } from "../server";
import { Server } from "socket.io";

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});

export { serverHttp, io };