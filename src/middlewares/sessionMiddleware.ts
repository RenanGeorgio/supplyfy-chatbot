import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/types";

const sessionMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        if (req.session && req.session.id) {            
            next(); 
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (err: any) {
        return res.status(500).send({ message: err.message });
    }
};

export default sessionMiddleware;