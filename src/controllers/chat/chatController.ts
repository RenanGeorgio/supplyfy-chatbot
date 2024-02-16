import { Response, NextFunction } from "express";
import { CustomRequest } from "../../helpers/customRequest";
import { processQuestion } from "../../helpers/trainModel";

export const message = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { question } = req.body;  
        let response = await processQuestion(question);
        return res.status(200).send(response);
    } catch (error) {
        next(error);
    }           
};