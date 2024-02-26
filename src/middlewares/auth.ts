import { NextFunction, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { CustomRequest, User as IUser } from "../types/customRequest";

const JWT = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (token == null) {
            return res.status(401).send();
        }

        const user = <IUser>(
            jsonwebtoken.verify(token, process.env.TOKEN_SECRET || "secret")
        );

        if (!user) {
            return res.status(403).send({ message: "Invalid JWT." });
        }
        
        req.user = user;

        next();
    } catch (err: any) {
        if (err.name === "JsonWebTokenError") {
            return res.status(403).send({ message: "Invalid JWT." });
        }

        return res.status(500).send({ message: err.message });
    }
};


const authMiddleware = { JWT };

export default authMiddleware;