import express, { ErrorRequestHandler, Response, NextFunction } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import createError from "http-errors";
import RedisStore from "connect-redis";
// import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { redisClient } from "./core/redis";
import { apiRoutes, routes } from "./routes";
import resolvers from "./core/resolvers";
import typeDefs from "./core/schemas";
import { fbWebhookRouter, igWebhookRouter, waWebhookRouter } from "./webhooks";
import { sessionMiddleware } from "./middlewares";
import BullBoard from "./libs/BullBoard";
import { CustomRequest } from "./types/types";

const store = new RedisStore({ client: redisClient, prefix: "chatbot:" });

const customSession = session({
  secret: process.env.SESSION_TOKEN ? process.env.SESSION_TOKEN.replace(/[\\"]/g, '') : "secret",
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false }
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

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(customSession);

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

// app.use(
//   "/models",
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//   })
// );

// app.use(sessionMiddleware, serviceSelectorMiddleware);
app.use(sessionMiddleware);

app.use('/whatsapp-incoming', waWebhookRouter);
app.use('/ig-incoming', igWebhookRouter);
app.use('/facebook-incoming', fbWebhookRouter);
// app.use('/incoming', webhookRouter);

app.use('/api/v1', apiRoutes);
app.use('/v1', routes);

const node_env = process.env.NODE_ENV ? process.env.NODE_ENV.replace(/[\\"]/g, '') : "development";
if (node_env === "development") {
  BullBoard(routes);
}

// catch not defined routes
app.use(function (req: CustomRequest, res: Response, next: NextFunction) {
  next(createError(404));
});

// catch all errors
app.use(((error: any, req: CustomRequest, res: Response, next: NextFunction) => {
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};
  res.status(error.status || 500).send({ message: error.message });
}) as ErrorRequestHandler);

export default app;
