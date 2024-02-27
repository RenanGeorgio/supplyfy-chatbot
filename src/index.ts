import "express-async-errors";

import * as dotenv from "dotenv";
dotenv.config();

import * as database from "./database";
import { serverHttp } from "./core/http";
import { Server } from "socket.io";
// import "./websocket";

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "http://localhost";

serverHttp.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});

const io = new Server(serverHttp, {
    cors: {
        origin: "http://localhost:7000",
    },
});

export { io };