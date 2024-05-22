import http from "http";
import { Server } from "socket.io";
import { app } from "../server";

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});

export { serverHttp, io };