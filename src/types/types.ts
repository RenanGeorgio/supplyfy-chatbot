import TelegramBot from "node-telegram-bot-api";

export type TelegramServiceController = {
  telegramService: TelegramBot[];
  start: (token: string) => Promise<TelegramBot | null>;
  stop: (botUsername: string) => Promise<boolean | null>;
  resume: (botUsername: string) => Promise<boolean | null>;
};


export type RegisterClient = {
  email: string;
  name: string;
  lastName?: string;
};