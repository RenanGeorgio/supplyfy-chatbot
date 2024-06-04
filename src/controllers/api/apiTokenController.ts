import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import { userExist } from "../../repositories/user";

import generateApiToken from "../../helpers/generateApiToken";
import { createApiToken } from "../../repositories/clientApi";

export const create = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const checkUser = await userExist(req.user?.sub as string);

    if (!checkUser) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const apiToken = generateApiToken(checkUser._id);

    const saveToken = createApiToken({
      userId: checkUser._id.toString(),
      token: apiToken,
    });

    if (!saveToken) {
      return res.status(400).send({ message: "Erro ao salvar token" });
    }

    return res.status(201).send({ apiToken });
  } catch (error) {
    next(error);
  }
};