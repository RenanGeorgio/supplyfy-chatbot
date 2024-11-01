import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import { DirectlineService, MsgToBot } from "../../libs/bot/connector/directLine";
import Queue from "../../libs/Queue";
import { BotMsgValue } from "../../types/types";
import { Platforms } from "../../types/enums";

export const create = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { text, conversation, name, id } = req.body;

        const value: BotMsgValue = {
            service: Platforms.WEB,
            messageId: '1',
            to: 'teste',
            phoneNumber: '999999999',
            phoneNumberId: id,
            name
        }
        const directLineService = DirectlineService.getInstance();
        const msg: MsgToBot = {
            text, 
            id,
            name,
            conversation,
            value
        }
        directLineService.sendMessageToBot(msg);

        return res.status(200).send("Message created!");
    } catch (error) {
        next(error);
    }
};