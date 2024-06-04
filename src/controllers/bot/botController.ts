import { NextFunction, Response } from "express";
import { botExist, createBot, updateBot } from "../../repositories/bot";
import { userExist } from "../../repositories/user";
import { checkServices } from "../../helpers/services/checkServices";
import { CustomRequest, IBotData } from "../../types";

export const create = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { services, socket } = req.body;
    
    if (!services) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes" });
    }

    const checkUser = await userExist(req.user?.sub as string);

    const companyId = checkUser?.companyId as string;

    const existingBot = await botExist("companyId", companyId);
    
    let bot = {} as any;

    if (existingBot) {
      const { success, message } = await checkServices(existingBot as unknown as IBotData, services);

      if (success === false) {
        return res.status(400).json({ message });
      }

      bot = await updateBot({ companyId, services });
    } else {
      bot = await createBot({ companyId, services, socket });
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