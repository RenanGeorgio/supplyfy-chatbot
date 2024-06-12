import chatClientModel from "../models/chat/chatClientModel";

export async function clientChatExist(username: string) {
  const clientExist = await chatClientModel.findOne({
    username: username,
  }).exec();

  return clientExist;
}

export async function createChatClient(
  email: string,
  name: string,
  lastName: string
) {
  try {
    const checkClient = await clientChatExist(email);
    if (checkClient) {
      return checkClient;
    }
    const client = await chatClientModel.create({
      name,
      lastName,
      email,
    });
    return client;
  } catch (error: any) {
    console.error(error);
  }
}