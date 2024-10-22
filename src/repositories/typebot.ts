import { ObjectId } from "mongoose";
import { mongoErrorHandler } from "../helpers/errorHandler";
import typebotModel from "../models/typebot/typebotModel";

export async function findTypebot(path: string, value: string) {
  try {
    const typebot = await typebotModel.findOne({ [path]: value }).exec();
    return typebot;
  } catch (error) {
    mongoErrorHandler(error);
  }
}

export async function createTypebot(
  typebotId: string,
  workspaceId: string,
  companyId: string
) {
  try {
    const typebot = await typebotModel.create({
      typebotId,
      workspaceId,
      companyId,
    });

    return typebot;
  } catch (error) {
    mongoErrorHandler(error);
  }
}

export async function removeTypebot(path: string, value: string | ObjectId) {
  try {
    const typebot = await typebotModel
      .findOneAndDelete({ [path]: value })
      .exec();

    return { success: true, message: "Typebot removido com sucesso" };
  } catch (error) {
    return mongoErrorHandler(error);
  }
}
