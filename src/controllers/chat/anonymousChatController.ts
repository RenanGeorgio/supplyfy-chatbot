import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import { DirectlineService } from "../../libs/bot/connector/directLine";
import Queue from "../../libs/Queue";

export const create = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { message, conversationId, userId, name } = req.body;

        const directLineService = DirectlineService.getInstance();
        directLineService.sendMessageToBot(message, userId, name, conversationId);

        return res.status(200).send("Message created!");
    } catch (error) {
        next(error);
    }
};