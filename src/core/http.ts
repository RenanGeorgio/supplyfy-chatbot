import http from "http";
import app from "../server";
import { io } from "socket.io-client";

const serverHttp = http.createServer(app);

const crmSocketClient = io("http://localhost:7000");

crmSocketClient.on("connect", () => {
  console.log("Conectado ao CRM Server");
});

export { serverHttp, crmSocketClient };
