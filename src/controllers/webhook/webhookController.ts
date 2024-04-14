import { NextFunction, Response } from "express";
import { CustomRequest } from "../../types";
import { userExist } from "../../repositories/user";
import { createWebhook } from "../../repositories/webhook";

export const create = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL não fornecida" });
    }

    const checkUser = await userExist(req.user?.sub as string);
    const companyId = checkUser?.companyId as string;

    if(!checkUser) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const webhook = await createWebhook({ url, companyId });
    
    if (!webhook) {
      return res.status(400).json({ message: "Erro ao criar webhook" });
    }

    return res.status(201).json(webhook);
  } catch (error) {
    next(error);
  }
};
