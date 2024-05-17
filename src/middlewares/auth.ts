import { NextFunction, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { CustomRequest, User as IUser } from "../types";

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

const authMiddleware = { JWT };

export default authMiddleware;