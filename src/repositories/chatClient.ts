import chatClientModel from "../models/chat/chatClientModel";

export async function listCHatClients(){
  const clients = await chatClientModel.find();
  return clients;
}

export async function clientChatExist(username: string) {
  const clientExist = await chatClientModel.findOne({
    "username": username,
  }).exec();

  return clientExist;
}

export async function createChatClient(
  username: string,
  name: string,
  lastName: string
) {
  try {
    const checkClient = await clientChatExist(username);
    if (checkClient) {
      return checkClient;
    }
    const client = await chatClientModel.create({
      name,
      lastName,
      username,
    });
    return client;
  } catch (error: any) {
    console.error(error);
  }
}