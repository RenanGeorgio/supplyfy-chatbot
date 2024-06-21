import Chat from "../../models/chat/chatModel";
import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../../types";

export const createChat = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.sub;
  const { firstId, secondId, origin } = req.body;

  if (!firstId || !secondId || !origin) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const chat = await Chat.findOne({
      origin,
      members: { $all: [firstId, secondId] },
    });

    if (chat) {
      return res.status(200).send(chat);
    }

    const newChat = new Chat({
      members: [firstId, secondId],
      origin,
    });

    const savedChat = await newChat.save();

    return res.status(201).send(savedChat);
  } catch (error: any) {
    next(error);
  }
};

export const findUserChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({
      members: { $in: [userId] },
    });

    return res.status(200).send(chats);
  } catch (error: any) {
    next(error);
  }
};

export const findChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstId, secondId } = req.params;

  try {
    const chat = await Chat.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) {
      return res.status(200).send(chat);
    }

    return res.status(404).send("Chat not found");
  } catch (error: any) {
    next(error);
  }
};