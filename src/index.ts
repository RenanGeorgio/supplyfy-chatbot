import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import { serverHttp } from "./core/http";

import produce from "./core/kafka/producer";
import consume from "./core/kafka/consumer";

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "http://localhost";

serverHttp.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});

consume().then(() => console.log("Kafka recebido!")).catch((err) => console.log(err.message));
produce("logs", { value: "TESTE" }).then(() => console.log("Kafka enviado!")).catch((err) => console.log(err.message));