import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import { processQuestion } from "../../libs/nlp/manager";

export const create = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { message } = req.body;
        const response = await processQuestion(message);

        return res.status(200).send({ message: response });
    } catch (error) {
        next(error);
    }
};