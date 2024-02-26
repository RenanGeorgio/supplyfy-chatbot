import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import { processQuestion } from "../../libs/trainModel";
import Message from "../../models/chat/Message";

export const create = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { chat, text, date } = req.body;  

        const response = await processQuestion(text);

        const message = new Message({
            name: chat.first_name + " " + chat.last_name,
            chatId: chat.id,
            message: text,
            answer: response,
            date: date
        });

        await message.save();

        return res.status(200).send(message);
    } catch (error) {
        next(error);
    }           
};

export const list = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        const messages = await Message.find({ chatId: id });

        return res.status(200).send(messages);
    } catch (error) {
        next(error);
    }
};