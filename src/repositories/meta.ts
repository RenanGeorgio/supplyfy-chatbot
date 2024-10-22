import { mongoErrorHandler } from "../helpers/errorHandler";
import companyModel from "../models/company/companyModel";

interface IMetaAuthData {
  companyId: string;
  accessToken?: string;
  expiresIn?: number;
  reauthorizeRequiredIn?: number;
  signedRequest?: string;
  userId?: string;
  tokenType?: string;
}

export async function createOrUpdateAuthData({
  companyId,
  accessToken,
  expiresIn,
  reauthorizeRequiredIn,
  signedRequest,
  userId,
  tokenType
}: IMetaAuthData) {
  try {
    // assume que o bot já existe
    const create = await companyModel.findOneAndUpdate(
      {
        companyId: companyId,
      },
      {
        $set: {
          "meta": {
            accessToken,
            expiresIn,
            reauthorizeRequiredIn,
            signedRequest,
            userId,
            tokenType,
          },
        },
      }
    );

    return create;
  } catch (error: any) {
    return mongoErrorHandler(error);
  }
}
