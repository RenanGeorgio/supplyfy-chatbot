import Chat from "../../models/chat/chatModel";
import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import { userExist } from "../../repositories/user";
import { updateChatAgent, updateChatStatus } from "../../repositories/chat";

export const createChat = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await userExist(req.user?.sub as string);
  const { clientId, origin } = req.body;

  if (!clientId || !origin || !user) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const chat = await Chat.findOne({
      origin,
      members: { $all: [user.companyId, clientId] },
    });

    if (chat) {
      return res.status(200).send(chat);
    }

    const newChat = new Chat({
      members: [user.companyId, clientId],
      origin,
    });

    const savedChat = await newChat.save();

    return res.status(201).send(savedChat);
  } catch (error: any) {
    next(error);
  }
};

export const findUserChats = async (
  req: CustomRequest,
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
  req: CustomRequest,
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

export const updateStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).send("Chat not found");
    }

    const { status, inProgress } = req.body;

    const updatedChat = await updateChatStatus(req.params.chatId, {
      status,
      inProgress,
    });

    return res.status(200).send(updatedChat);
  } catch (error: any) {
    next(error);
  }
};

export const updateAgent = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const chat = await Chat.findById(req.params.chatId);

    if (!chat) {
      return res.status(404).send("Chat not found");
    }

    const { assignedAgent } = req.body;

    const updatedChat = await updateChatAgent(req.params.chatId, assignedAgent);

    return res.status(200).send(updatedChat);
  } catch (error: any) {
    next(error);
  }
};
