import chatClientModel from "../models/chat/chatClientModel";

export async function listCHatClients(){
  const clients = await chatClientModel.find();
  return clients;
}

export async function clientChatExist(email: string) {
  const clientExist = await chatClientModel.findOne({
    email: email,
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
