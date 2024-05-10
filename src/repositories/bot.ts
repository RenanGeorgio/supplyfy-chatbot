import { mongoErrorHandler } from "../helpers/errorHandler";
import BotModel from "../models/bot/botModel";
import { IBotData } from "../types/types";

export async function botExist(path: string, value: string) {
  try{
    const botExist = await BotModel.findOne({
      [path]: value,
    });
  
    return botExist;
  }
  catch(error: any){
    throw error;
  }
}

export async function listAllBots() {
  try{
    const bots = await BotModel.find().exec();
    return bots;
  } catch (error: any) {
    throw error;
  }
}

export async function createBot(data: IBotData) {
  try {
    const bot = await BotModel.create(data);
    return bot;
  } catch (error: any) {
    throw error;
  }
}

export async function updateBot({ companyId, services }: Omit<IBotData, "socket">) {
  try {
    const bot = await BotModel.findOneAndUpdate({
      companyId: companyId,
    }, {
      $set: {
        "services.telegram": services.telegram,
        "services.instagram": services.instagram,
        "services.email": services.email,
        "services.facebook": services.facebook,
      }
    }, {
      new: true,
      runValidators: true
    }).exec();
    
    return bot;

  } catch (error: any) {
    throw error;
  }
}