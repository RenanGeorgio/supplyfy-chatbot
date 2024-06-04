import { ObjectId } from "mongoose";
import { mongoErrorHandler } from "../helpers/errorHandler";
import apiTokenModel from "../models/api/clientToken";

export async function checkApiToken(token: string) {
  try {
    const findToken = await apiTokenModel.findOne({
      token,
      isActive: true,
    });

    if (!findToken) {
      return null;
    }

    return findToken;
  } catch (error: any) {
    mongoErrorHandler(error);
  }
}

export async function createApiToken({
  userId,
  token,
}: {
  userId: string | ObjectId;
  token: string;
}) {
  try {
    const saveToken = await apiTokenModel.create({
      userId,
      token,
    });

    return saveToken;
  } catch (error: any) {
    mongoErrorHandler(error);
  }
}
