import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import { DirectlineService } from "../../libs/bot/connector/directLine";

export const create = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { message } = req.body;
        
        const directLineService = DirectlineService.getInstance();

        directLineService.sendMessageToBot(message, "123", "Anonymous");

        return res.status(200).send("Message created!");
    } catch (error) {
        next(error);
    }
};