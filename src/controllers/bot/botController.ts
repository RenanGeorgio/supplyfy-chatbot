import { Request, Response } from "express";
import BotModel from "../../models/bot/botModel";
import { telegramServiceController } from "../../services/telegram";

export const createBot = async (req: Request, res: Response) => {
  try {
    const { companyId, instagram, telegram } = req.body;

    if(!companyId || !instagram || !telegram) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if(!telegram.token) return res.status(400).json({ message: "Missing telegram token" });

    if(!instagram.username || !instagram.password) {
      return res.status(400).json({ message: "Missing instagram username or password" });
    }

    const checkIfExist = await BotModel.findOne({ companyId });

    if(!checkIfExist) {
      await BotModel.create({
        companyId,
        services: {
          instagram,
          telegram,
        },
      });
    }

    const bot = await telegramServiceController.start(telegram.token);

    if(!bot) {
      return res.status(500).json({ message: "Error creating bot" });
    }

    return res.status(201).json({ message: "Bot created" });
  } catch (error) {
    return res.status(500);
  }
};

export const stopBot = async (req: Request, res: Response) => {
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
    return res.status(500);
  }
};

export const resumeBot = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;

    if(!username) {
      return res.status(400).json({ message: "Missing bot username" });
    }

    const bot = await telegramServiceController.resume(username);
    console.log(bot)
    if(!bot) {
      return res.status(404).json({ message: "Bot not found" });
    }

    return res.status(200).json({ message: `Bot ${username} resumed` });
  } catch (error) {
    return res.status(500);
  }
};