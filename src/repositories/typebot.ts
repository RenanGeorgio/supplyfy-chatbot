import { mongoErrorHandler } from "../helpers/errorHandler";
import typebotModel from "../models/typebot/typebotModel";

interface Typebot {
  companyId: string;
  typebotId: string;
  workspaceId: string;
}

export async function createTypebot({
  companyId,
  typebotId,
  workspaceId,
}: Typebot) {
  try {
    const typebot = await typebotModel.create({
      companyId,
      typebotId,
      workspaceId,
    });
    return typebot;
  } catch (error) {
    return mongoErrorHandler(error);
  }
}

export async function removeTypebot(typebotId: string) {
  try {
    const typebot = await typebotModel.findOneAndDelete({ typebotId });
    return typebot;
  } catch (error) {
    return mongoErrorHandler(error);
  }
}
