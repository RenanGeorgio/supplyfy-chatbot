import { MongooseError } from "mongoose";
import ClientModel from "../models/chat/client";

export async function clientExist(email: string) {
  const clientExist = await ClientModel.findOne({
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
    const client = await ClientModel.create({
      name,
      lastName,
      email,
    });
    return client;
  } catch (error: any) {
    console.error(error);
  }
}
