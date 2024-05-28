import { NextFunction, Response } from "express";
import { CustomRequest } from "../../types";
import { createTypebot, removeTypebot } from "../../repositories/typebot";

export const create = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { typebotId, workspaceId, companyId } = req.body;

    if (!typebotId || !workspaceId) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes" });
    }

    const typebot = await createTypebot(typebotId, workspaceId, companyId);

    if (!typebot) {
      return res.status(400).json({ message: "Erro ao criar Ignai bot" });
    }

    return res.status(201).json({ message: "Ignai bot criado" });
  } catch (error) {
    next(error);
  }
};

export const remove = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { typebotId } = req.params;

    console.log(typebotId)
    if (!typebotId) {
      return res.status(400).json({ message: "Campo obrigatório ausente" });
    }

    const typebot = await removeTypebot(typebotId);
    console.log(typebot)
    if (!typebot) {
      return res.status(400).json({ message: "Erro ao remover Ignai bot" });
    }

    return res.status(200).json({ message: "Ignai bot removido" });
  } catch (error) {
    next(error);
  }
}
