import { NextFunction, Request, Response } from "express";
import { botExist, createBot, updateBot } from "../../repositories/bot";
import { checkServices } from "../../services/helpers/checkServices";

import { CustomRequest, IBotData } from "../../types";
import { userExist } from "../../repositories/user";

export const create = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { services } = req.body;

    if (!services) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes" });
    }

    const checkUser = await userExist(req.user?.sub as string);

    const companyId = checkUser?.companyId as string;

    const existingBot = await botExist("companyId", companyId);

    let bot = {} as any;

    if (existingBot) {
      const { success, message } = await checkServices(existingBot as IBotData, services);

      if (success === false) {
        return res.status(400).json({ message });
      }

      bot = await updateBot({ companyId, services });
    } else {
      bot = await createBot({ companyId, services });
      // await checkServices({}, services);
    }

    if (bot && "success" in bot && !bot.success) {
      const { message, error } = bot;
      throw new Error(`${message}, ${error}`);
    }

    return res.status(201).json({ message: "Bot criado" });
  } catch (error) {
    next(error);
  }
};