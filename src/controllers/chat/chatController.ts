import { Response, NextFunction } from "express";
import { CustomRequest } from "../../helpers/customRequest";
import { processQuestion } from "../../helpers/trainModel";
import Message from "../../models/chat/message";
import User from "../../models/user/User";

export const create = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) {
            return res.status(403).send({ message: "Unauthorized" });
        }
        const user = await User.findById(req.user.sub);
        if (!user) {
            return res.status(403).send({ message: "Unauthorized" });
        }
        const { chat, text, date } = req.body;  
        const response = await processQuestion(text);

        const message = new Message({
            name: user.name,
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
        if (!req.user) {
            return res.status(403).send({ message: "Unauthorized" });
        }
        const user = await User.findById(req.user.sub);
        if (!user) {
            return res.status(403).send({ message: "Unauthorized" });
        }
        const { id } = req.params;
        const messages = await Message.find({ chatId: id });
        return res.status(200).send(messages);
    } catch (error) {
        next(error);
    }
};