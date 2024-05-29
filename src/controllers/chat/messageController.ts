import { Request, Response } from "express";
import messageModel from "../../models/chat/messageModel";

export const createMessage = async (req: Request, res: Response) => {
  const { chatId, senderId, text } = req.body;

  try {
    const message = new messageModel({
      chatId,
      senderId,
      text,
    });

    const savedMessage = await message.save();

    return res.status(201).json(savedMessage);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    return res.status(201).json(messages);
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};
