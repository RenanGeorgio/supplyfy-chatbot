import { Response, NextFunction } from "express";
import { CustomRequest } from "../../types";
import { createTypebot, removeTypebot } from "../../repositories/typebot";

export const create = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId, typebotId, workspaceId } = req.body;

    if (!companyId || !typebotId || !workspaceId) {
      return res.status(400).send({ message: "Campos obrigatórios ausentes" });
    }

    const create = await createTypebot(req.body);

    if ("success" in create && !create.success) {
      console.log(create);
      return res.status(400).send({
        message: create.message,
      });
    }
    return res.status(201).send(create);
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

    if (!typebotId) {
      return res.status(400).send({ message: "Campo obrigatório ausente" });
    }

    const remove = await removeTypebot(typebotId);

    if (!remove) {
      return res.status(404).send({ message: "Typebot não encontrado" });
    }

    return res.status(200).send({ message: "Typebot removido com sucesso" });
  } catch (error) {
    next(error);
  }
};
