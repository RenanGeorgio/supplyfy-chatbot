import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import app from "./server";
import { Server } from "socket.io";
import http from "http";
import "./services";

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "http://localhost";

const serverHttp = http.createServer(app);
export const io = new Server(serverHttp);

serverHttp.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});

