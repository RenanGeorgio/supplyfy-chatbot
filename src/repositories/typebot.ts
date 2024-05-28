import { mongoErrorHandler } from "../helpers/errorHandler";
import typebotModel from "../models/typebot/typebotModel";

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
    console.log(typebot);
    return typebot;
  } catch (error) {
    mongoErrorHandler(error);
  }
}

export async function removeTypebot(typebotId: string) {
  try {
    const typebot = await typebotModel.findOneAndDelete({ typebotId }).exec();
    console.log(typebot);
    return { success: true, message: "Typebot removido com sucesso" };
  } catch (error) {
    return mongoErrorHandler(error);
  }
}
