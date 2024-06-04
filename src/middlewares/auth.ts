import { NextFunction, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { CustomRequest, User as IUser } from "../types";
import { checkApiToken } from "../repositories/clientApi";

const JWT = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null) {
            return res.status(401).send();
        }
        const user = <IUser>(
            jsonwebtoken.verify(token, process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET.replace(/[\\"]/g, '') :  "secret")
        );
        if (!user) {
            return res.status(403).send({ message: "Invalid JWT." });
        }
        req.user = user;
        next();
    } catch (error: any) {
        if (error.name === "JsonWebTokenError") {
            return res.status(403).send({ message: "Invalid JWT." });
        }
        next(error);
    }
};

const apiMiddleware = async(req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return res.status(401).send();
    }

    const user = <IUser>(
      jsonwebtoken.verify(token, process.env.API_TOKEN_SECRET as string)
    );

    if (!user) {
      return res.status(403).send({ message: "Invalid JWT." });
    }

    const tokenExistInDb = await checkApiToken(token);

    if (!tokenExistInDb) {
      return res.status(403).send({ message: "Token não é mais válido" });
    }

    req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).send({ message: "Invalid JWT." });
    }
    next(error);
  }
};

const authMiddleware = { JWT, apiMiddleware };

export default authMiddleware;