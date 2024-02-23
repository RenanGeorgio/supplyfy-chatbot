import TelegramBot from "node-telegram-bot-api";

export const findTelegramBot = async (
  telegramService: TelegramBot[],
  botUsername: string
) => {
  for (const bot of telegramService) {
    const username = (await bot.getMe()).username;
    if (username === botUsername) {
      return bot;
    }
  }
  return null;
};
