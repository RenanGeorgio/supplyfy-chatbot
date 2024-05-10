import http from "http";
import { app } from "../server";

const serverHttp = http.createServer(app);

export { serverHttp };