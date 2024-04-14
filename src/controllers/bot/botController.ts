import { NextFunction, Request, Response } from "express";
import BotModel from "../../models/bot/botModel";
import { telegramServiceController } from "../../services/telegram";
import { botExist, createBot, updateBot } from "../../repositories/bot";
import { userExist } from "../../repositories/user";
import { checkServices } from "../../services/helpers/checkServices";
import produce from "../../core/kafka/producer";
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

export const createBot = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { companyId, instagram, telegram } = req.body;
    const userId = req.user?.sub;

    if(!companyId || !instagram || !telegram) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if(!telegram.token) return res.status(400).json({ message: "Missing telegram token" });

    if(!instagram.username || !instagram.password) {
      return res.status(400).json({ message: "Missing instagram username or password" });
    }

    const checkIfExist = await BotModel.findOne({ companyId });

    const bot = await telegramServiceController.start(telegram.token);
    
    if(!bot) {
      return res.status(500).json({ message: "Error creating bot" });
    }

    if(!checkIfExist) {
      await BotModel.create({
        companyId,
        userId,
        services: {
          instagram,
          telegram,
        },
      });
    }
       
    if(!bot) {
      return res.status(500).json({ message: "Error creating bot" });
    }

    await produce('logs', { value: 'Telegram bot created' })
    return res.status(201).json({ message: "Bot created" });
  } catch (error) {
    next(error);
  }
};

export const stopBot = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;

    if(!username) {
      return res.status(400).json({ message: "Missing bot username" });
    }

    const bot = await telegramServiceController.stop(username);

    if(!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }

    return res.status(200).json({ message: `Bot ${username} stopped` });
  } catch (error) {
    next(error);
  }
};

export const resumeBot = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;

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