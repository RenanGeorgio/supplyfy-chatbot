import { NextFunction, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { checkApiToken } from "../repositories/clientApi";
import { CustomRequest, User as IUser } from "../types";

const JWT = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        
        if (token == null) {
            return res.status(401).send();
        }

        const env_token = process.env.TOKEN_SECRET as string;
        const user = <IUser>(
            jsonwebtoken.verify(token, env_token.replace(/[\\"]/g, ''))
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
      return res.status(401).send({ message: "Api Token não informado" });
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
      console.error(error, process.env.API_TOKEN_SECRET);
      return res.status(403).send({ message: "Invalid JWT." });
    }
      
    next(error);
  }
};

const auth0 = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    // const url = `${req.protocol}://${req.get('host')}`;
    // if (url === process.env.AUTH0_ISSUER) {
    //   return res.status(401).send({ message: "Unauthorized" });
    // }
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
      
    if (token == null) {
      return res.status(401).send();
    }
      
    const valid = jsonwebtoken.verify(token, process.env.TOKEN_SECRET ? process.env.TOKEN_SECRET.replace(/[\\"]/g, '') : "secret");
      
    if (!valid) {
      return res.status(403).send({ message: "Invalid JWT." });
    }
      
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).send({ message: "Invalid JWT." });
    }
      
    next(error);
  }
};

const authMiddleware = { JWT, apiMiddleware, auth0 };

export default authMiddleware;
