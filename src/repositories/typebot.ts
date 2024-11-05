import { ObjectId } from "mongoose";
import { mongoErrorHandler } from "../helpers/errorHandler";
import typebotModel from "../models/typebot/typebotModel";

interface Typebot {
  companyId: string;
  typebotId: string;
  workspaceId: string;
  token: string
}

export async function findTypebot(path: string, value: string) {
  try {
    const typebot = await typebotModel.findOne({ [path]: value });
    return typebot;
  } catch (error) {
    throw mongoErrorHandler(error);
  }
}

export async function createTypebot({
  companyId,
  typebotId,
  workspaceId,
  token
}: Typebot) {
  try {
    const typebot = await typebotModel.create({
      companyId,
      typebotId,
      workspaceId,
      token
    });
    return typebot;
  } catch (error) {
    throw mongoErrorHandler(error);
  }
}

export async function removeTypebot(typebotId: string) {
  try {
    const typebot = await typebotModel.findOneAndDelete({ typebotId });
    
    return { success: true, message: "Typebot removido com sucesso" };
  } catch (error) {
    throw mongoErrorHandler(error);
  }
}