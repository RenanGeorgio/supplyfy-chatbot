import { NextFunction, Response } from "express";
import { botExist, createBot, updateBot } from "../../repositories/bot";
import { findUserByField, userExist } from "../../repositories/user";
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
      const { success, message } = await checkServices(
        existingBot as unknown as IBotData,
        services
      );

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

export const listServices = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // const { userId } = req.params;
    const { email } = req.params;
    // const checkUser = await userExist((req.user?.sub as string) || userId); // esperar resolver a falta do token com userId
    const checkUser = await findUserByField("email", email);
    const companyId = checkUser?.companyId as string;
    const bot = await botExist("companyId", companyId);

    if (!bot) {
      return res.status(404).json({ message: "Bot não encontrado" });
    }

    const services = bot.services;

    if (services) {
      return res.status(200).json({
        telegram: services.telegram
          ? { username: services.telegram.username }
          : null,
        instagram: services.instagram
          ? { username: services.instagram.username }
          : null,
        email: services.email
          ? { username: services.email.emailUsername }
          : null,
        // facebook: services.facebook ? services.facebook : null,
      });
    }

    return res.status(404).json({ message: "Nenhum serviço cadastrado" });
  } catch (error) {
    next(error);
  }
};
