import { mongoErrorHandler } from "../helpers/errorHandler";
import BotModel from "../models/bot/botModel";
import { IBotData } from "../types/types";

export async function botExist(path: string, value: string) {
  const botExist = await BotModel.findOne({
    [path]: value,
  });

  return botExist;
}

export async function listAllBots() {
  const bots = await BotModel.find().exec();
  return bots;
}

export async function createBot({ companyId, userId, services }: IBotData) {
  try {
    const bot = await BotModel.create({
      companyId,
      userId,
      services,
    });
    console.log(bot)
    return bot;
  } catch (error: any) {
    return mongoErrorHandler(error);
  }
}

export async function updateBot({ companyId, services }: IBotData) {
  try {
    const bot = await BotModel.findOneAndUpdate({
      companyId: companyId,
    }, {
      $set: {
        "services.telegram": services.telegram,
        "services.instagram": services.instagram,
        "services.email": services.email,
      }
    }, {
      new: true,
    }).exec();
    
    return bot;

  } catch (error: any) {
    return mongoErrorHandler(error);
  }
}