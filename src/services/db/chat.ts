import ChatModel from "../../models/chat/client";

export async function clientExist(email: string) {
  const clientExist = await ChatModel.findOne({
    email: email,
  }).exec();

  return clientExist;
}