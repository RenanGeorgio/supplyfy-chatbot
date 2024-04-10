import http from "http";
import { app } from "../server";
import { io } from "socket.io-client";
// import produce from "./kafka/producer";

const serverHttp = http.createServer(app);

const crmSocketClient = io(process.env.CRM_SERVER_URL as string, {
  auth: {
    token: process.env.CRM_SERVER_TOKEN,
  },
  reconnection: true,
  reconnectionDelay: 5000,
  // reconnectionAttempts: 10,
});

crmSocketClient.on("connect", () => {
  console.log("Conectado ao CRM Server");
});

crmSocketClient.on("connect_error", (error) => {
  console.log("Sem conexão com o CRM Server");
  // produce("chatbot-socket", {
  //   value: "Ocorreu um erro ao conectar com o CRM Server"
  // })
});

export { serverHttp, crmSocketClient };