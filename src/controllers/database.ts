import { Response, Request, NextFunction } from "express";
import mongoose from "../core/database";

export const test = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const url = process.env.MONGO_URL ? process.env.MONGO_URL.replace(/[\\"]/g, '') : ""
        console.log(url)
        const result = await mongoose.connection.readyState;
        if (result === 1 ){
            return res.status(200).send({ message: "Server is OK! " + url });
        }
        else {
            return res.status(500).send({ message: "Database is not connected! " + url });
        }
    } catch (error) {
        next(error); 
    }
};
