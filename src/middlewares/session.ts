import { NextFunction, Response } from "express";
import { CustomRequest } from "../types";

const sessionMiddleware = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        if (req.session && req.session.id) {
            if (req.session.service == null || req.session.service == undefined || req.session.service == ""){
                req.session.service = "cadastro"
            }
            next();
        } else {
            return res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error: any) {
        next(error);
    }
};

export default sessionMiddleware;