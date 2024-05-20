import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import mongoose from "../../database";

export const test = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        return res.status(200).send({ message: "Server is OK!" });
    } catch (error) {
        next(error);
    }
};

export const session = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        return res.status(200).send(req.session);
    } catch (error) {
        next(error);
    }
};


export const database = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const result = mongoose.connection.readyState;
        if (result === 1) {
            return res.status(200).send({ message: "Server is OK!" });
        }
        else {
            return res.status(500).send({ message: "Database is not connected!" });
        }
    } catch (error) {
        next(error);
    }
};