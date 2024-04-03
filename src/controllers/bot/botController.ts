import { NextFunction, Request, Response } from "express";
import { telegramServiceController } from "../../services/telegram";
import { botExist, createBot, updateBot } from "../../repositories/bot";
import { checkServices } from "../../services/helpers/checkServices";
import { servicesActions } from "../../services";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { companyId, userId, services } = req.body;
  
    if (!companyId) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes" });
    }

    const existingBot = await botExist("companyId", companyId);
    let bot = {} as any;
    if (existingBot) {
      const { success, message } = await checkServices(existingBot, services);

      if (success === false) {
        return res.status(400).json({ message });
      }
      
      bot = await updateBot({ companyId, services });
    } else {
      const startService = await checkServices({}, services);
      bot = await createBot({ companyId, userId, services });
    }

    if (bot && "success" in bot && !bot.success) {
      console.log('aqui?')
      const { message, error } = bot;
      throw new Error(`${message}, ${error}`);
    }

    return res.status(201).json({ message: "Bot created" });
  } catch (error) {
    next(error);
  }
};

export const stop = async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Identificação não fornecida" });
    }

    const serviceControl = servicesActions[service];

    if (!serviceControl) {
      res.status(400).json({ message: "Serviço fornecido é inválido" });
    }

    const bot = await serviceControl.stop(id)
    console.log(bot)
    return res.status(200).json({ message: `Bot foi parado` });
  } catch (error) {
    return res.status(500);
  }
};

export const resume = async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Identificação não fornecida" });
    }

    const serviceControl = servicesActions[service];

    if (!serviceControl) {
      res.status(400).json({ message: "Serviço fornecido é inválido" });
    }

    const bot = await serviceControl.resume(id)

    return res.status(200).json({ message: `Bot foi iniciado` });
  } catch (error) {
    return res.status(500);
  }
};
