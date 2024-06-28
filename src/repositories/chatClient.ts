import { mongoErrorHandler } from "../helpers/errorHandler";
import chatClientModel from "../models/chat/chatClientModel";

export async function listChatClients(companyId: string) {
  try {
    const clients = await chatClientModel
      .find({
        companyId,
      })
      .select("-companyId"); // remove o campo companyId

    return clients;
  } catch (error) {
    mongoErrorHandler(error);
  }
}

export async function clientChatExist(username: string, companyId: string) {
  const clientExist = await chatClientModel
    .findOne({
      username: username,
      companyId,
    })
    .exec();

  return clientExist;
}

export async function findChatClientById(_id: string) {
  try {
    const client = await chatClientModel.findById(_id).select("-companyId");
    return client;
  }
  catch (error: any) {
    mongoErrorHandler(error);
  }
}

export async function createChatClient(
  username: string,
  name: string,
  lastName: string,
  companyId: string
) {
  try {
    const checkClient = await clientChatExist(username, companyId);
    // se o cliente já existir, retorna o cliente
    if (checkClient) {
      return checkClient;
    }
    const client = await chatClientModel.create({
      name,
      lastName,
      username,
      companyId,
    });
    return client;
  } catch (error: any) {
    console.error(error);
  }
}

export async function updateChatClient({
  _id,
  name,
  lastName,
  username,
  phone,
  address,
  email,
  metadata,
}) {
  try {
    const client = await chatClientModel.findByIdAndUpdate(
      _id,
      {
        name,
        lastName,
        username,
        phone,
        address,
        email,
        metadata,
      },
      { new: true }
    ).select("-companyId")

    return client;
  } catch (error: any) {
    return mongoErrorHandler(error);
  }
}