import http from "http";
import { app } from "../server";

const serverHttp = http.createServer(app);

/*
FEITO PELO SAMUEL
const crmSocketClient = io(process.env.CRM_SERVER_URL as string, {
  auth: {
    token: process.env.CRM_SERVER_TOKEN,
  },
  reconnection: true,
  reconnectionDelay: 1000
});

crmSocketClient.on("connect", () => {
  console.log("Conectado ao CRM Server");
});

crmSocketClient.on("connect_error", (error) => {
  console.log("Erro ao conectar com o CRM Server");
  produce("chatbot-socket", {
    value: "Ocorreu um erro ao conectar com o CRM Server"
  })
});
*/

// export { serverHttp, io }; OLD
export { serverHttp };