import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types/types";

export const test = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        return res.status(200).send({ message: "Server is OK!" });
    } catch (error) {
        next(error);
    }
};

export const session = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        return res.status(200).send(req.session);
    } catch (error) {
        next(error);
    }
};