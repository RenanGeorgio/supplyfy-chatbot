import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import { processQuestion } from "../../libs/trainModel";

export const create = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { text } = req.body;

        const response = await processQuestion(text);

        return res.status(200).send({ message: response });
    } catch (error) {
        next(error);
    }
};