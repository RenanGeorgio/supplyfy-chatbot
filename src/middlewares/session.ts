import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/customRequest";

const sessionMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        if (req.session && req.session.user) {
            next();
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err: any) {
        return res.status(500).send({ message: err.message });
    }
};

export default sessionMiddleware;