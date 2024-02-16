import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import app from "./server";

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "http://localhost";

app.listen(PORT, () => {
    console.log(`Server running on ${HOST}:${PORT}`);
});