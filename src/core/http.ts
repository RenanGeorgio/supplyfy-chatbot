import http from "http";
import { app } from "../server";
import { io } from "socket.io-client";

const serverHttp = http.createServer(app);

const crmSocketClient = io(process.env.CRM_SERVER_URL as string, {
  auth: { token: process.env.CRM_SERVER_TOKEN }
});

crmSocketClient.on("connect", () => {
  console.log("Conectado ao CRM Server");
});

crmSocketClient.on("connect_error", (error) => {
  crmSocketClient.disconnect();
});


export { serverHttp, crmSocketClient };