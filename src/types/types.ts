import TelegramBot from "node-telegram-bot-api";

export type TelegramServiceController = {
  telegramService: TelegramBot[];
  start: (token: string) => Promise<TelegramBot>;
  stop: (botUsername: string) => Promise<boolean | null>;
  resume: (botUsername: string) => Promise<boolean | null>;
};