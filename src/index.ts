import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import "./database";
import { serverHttp } from "./core/http";
//import "./websocket";

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "http://localhost";

console.log("APP_SECRET: " + process.env.APP_SECRET);
console.log("MONGO_URL: " + process.env.MONGO_URL);

serverHttp.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});


// import "./services";