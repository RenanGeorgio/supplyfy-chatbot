import http from "http";
import { Server } from "socket.io";
import { app } from "../server";
import { DirectlineServiceV2 as DirectlineService } from "../libs/bot/connector";

const serverHttp = http.createServer(app);

const directLineService = new DirectlineService();

const io = new Server(serverHttp, {
  cors: {
    origin: "*",
  },
});

export { serverHttp, io, directLineService };