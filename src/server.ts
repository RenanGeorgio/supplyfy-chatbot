import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import express, { ErrorRequestHandler, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import routes from "./routes";
import resolvers from "./core/resolvers";
import typeDefs from "./core/schemas";

const app = express();

app.use(cors());

// Copia raw body buffer para req["rawBody"] gerando a x-hub signature: necessaria para whatsapp cloud api
app.use(bodyParser.json({ verify: function (req, res, buf) { req.rawBody = buf; } }));
app.use(bodyParser.urlencoded( { extended : false }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const schema = makeExecutableSchema({
    resolvers,
    typeDefs,
});

app.use(routes);

app.use(
    "/models",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
);

// catch not defined routes
app.use((res: Response) => {
    res.status(404).send({ message: "Not found" });
});

// catch all errors
app.use(((error, req, res, next) => {
    res.status(error.status || 500).send({ message: error.message });
}) as ErrorRequestHandler);

export default app;
