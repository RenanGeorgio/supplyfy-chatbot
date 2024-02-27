import BotModel from "../../models/bot/botModel";

export async function botExist(token: string) {
  // find bot by token
  const botExist = await BotModel.findOne({
    "services.telegram.token": token,
  }).exec();

  return botExist;
}