import cookieParser from "cookie-parser";
import cors from "cors";
import express, { ErrorRequestHandler, Response } from "express";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

// catch not defined routes
app.use((res: Response) => {
    res.status(404).send({ message: "Not found" });
});

// catch all errors
app.use(((error, req, res, next) => {
    res.status(error.status || 500).send({ message: error.message });
}) as ErrorRequestHandler);

export default app;