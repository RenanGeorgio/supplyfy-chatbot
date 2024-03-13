import ChatModel from "../models/chat/chatModel";

export async function chatExist(
  members: string[],
  origin: { platform: string; chatId: string }
) {
  const chatExist = await ChatModel.findOne({
    members,
    origin,
  }).exec();

  return chatExist;
}
export async function createChat({
  members,
  origin,
}: {
  members: string[];
  origin: { platform: string; chatId: string };
}) {
  const checkChat = await chatExist(members, origin);
  if (checkChat) {
    return checkChat;
  }
  const createChat = await ChatModel.create({
    members,
    origin,
  });
  return createChat;
}
