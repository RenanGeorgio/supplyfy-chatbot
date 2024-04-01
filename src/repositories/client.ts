import chatClientModel from "../models/chat/chatClientModel";

export async function clientExist(email: string) {
  const clientExist = await chatClientModel.findOne({
    email: email,
  }).exec();

  return clientExist;
}

export async function createClient(
  email: string,
  name: string,
  lastName: string
) {
  try {
    const checkClient = await clientExist(email);
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
