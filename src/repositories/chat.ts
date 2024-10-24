import { mongoErrorHandler } from "../helpers/errorHandler";
import ChatModel from "../models/chat/chatModel";

export async function chatExist(
  members: string[],
  origin: { platform: string; chatId: string },
  status?: string
) {
  const chatExist = await ChatModel.findOne({
    members,
    origin,
    status,
  }).exec();

  return chatExist;
}

export async function findChatById(chatId: string) {
  try {
    const chat = await ChatModel.findById(chatId);
    return chat;
  } catch (error: any) {
    mongoErrorHandler(error);
  }
}

export async function chatOriginExist(origin: {
  platform: string;
  chatId: string;
}) {
  const clientExist = await ChatModel.findOne({
    origin: origin,
  }).exec();
  console.log(clientExist);
  return !!clientExist;
}

export async function createChat({
  members,
  origin,
}: {
  members: string[];
  origin: { platform: string; chatId: string };
}) {
  const checkChat = await chatExist(members, origin, "active");
  if (checkChat) {
    return checkChat;
  }
  const createChat = await ChatModel.create({
    members,
    origin,
  });
  return createChat;
}

export async function updateChatStatus(
  chatId: string,
  status: { status?: string; inProgress?: boolean }
) {
  try {
    const chat = await ChatModel.findByIdAndUpdate({ _id: chatId }, status, {
      new: true,
    });
    if (!chat) {
      return {
        error: "Chat not found",
        success: false,
      };
    }
    return chat;
  } catch (error: any) {
    return mongoErrorHandler(error);
  }
}

export async function updateChatAgent(chatId: string, assignedAgent: string) {
  try {
    const chat = await ChatModel.findByIdAndUpdate(
      { _id: chatId },
      { assignedAgent },
      { new: true }
    );

    if (!chat) {
      return {
        error: "Chat not found",
        success: false,
      };
    }
    return chat;
  } catch (error: any) {
    return mongoErrorHandler(error);
  }
}
