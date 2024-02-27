import ClientModel from "../../models/chat/client";

export async function clientExist(email: string) {
  const clientExist = await ClientModel.findOne({
    email: email,
  }).exec();

  return clientExist;
}