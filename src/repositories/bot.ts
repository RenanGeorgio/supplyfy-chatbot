import BotModel from "../models/bot/botModel";

export async function botExist(path: string, value: string) {
  const botExist = await BotModel.findOne({
    [path]: value,
  }).exec();

  return botExist;
}

export async function listAllBots() {
  const bots = await BotModel.find().exec();
  return bots;
}