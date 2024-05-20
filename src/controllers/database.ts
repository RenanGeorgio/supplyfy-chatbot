import { Response, Request, NextFunction } from "express";
import mongoose from "../core/database";

export const test = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await mongoose.connection.readyState;
        if (result === 1 ){
            return res.status(200).send({ message: "Server is OK!" });
        }
        else {
            return res.status(500).send({ message: "Database is not connected!" });
        }
    } catch (error) {
        next(error);
    }
};
