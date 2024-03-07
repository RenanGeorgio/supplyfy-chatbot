import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import express, { ErrorRequestHandler, Response, Request, NextFunction } from "express";
import createError from "http-errors";
import session from "express-session";
import RedisStore from "connect-redis";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { redisClient } from "./core/redis";
import routes from "./routes";
import resolvers from "./core/resolvers";
import typeDefs from "./core/schemas";
import * as webhookRouter from "./webhooks";
import { sessionMiddleware, serviceSelectorMiddleware } from "./middlewares";
import { CustomRequest } from "./types";

const store = new RedisStore({client: redisClient, prefix:"chatbot:"});

const customSession = session({
  secret: process.env.SESSION_TOKEN || "secret", // Replace with your actual secret key
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false } // Set secure to true if using HTTPS
})

const app = express();

app.use(cors());

// Copia raw body buffer para req["rawBody"] gerando a x-hub signature: necessaria para whatsapp cloud api
app.use(
  bodyParser.json({
    verify: function (req: CustomRequest, res: Response, buf: Buffer) {
      req.rawBody = buf;
    }
  })
);

app.use(bodyParser.urlencoded( { extended : false }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(customSession);

const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
});

app.use(
    "/models",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
);

app.use(sessionMiddleware, serviceSelectorMiddleware);

// app.use('/incoming', sessionMiddleware, serviceSelectorMiddleware, webhookRouter);

app.use(routes);

// catch not defined routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// catch all errors
app.use(((error: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};
  res.status(error.status || 500).send({ message: error.message });
}) as ErrorRequestHandler);

export { app, customSession };
