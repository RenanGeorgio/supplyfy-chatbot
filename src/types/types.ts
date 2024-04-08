import { Request } from "express";
import { Types } from "mongoose";
// import { WebhookEventBase } from "./meta";
import { Session } from "express-session";
import TelegramBot from "node-telegram-bot-api";
import { Transporter } from "nodemailer";
import { IMailListener } from "../services/email/lib/types";
import { IgApiClientRealtime } from "instagram_mqtt";

export interface User {
  sub: Types.ObjectId | string;
}

export interface CustomSession extends Session {
  service?: string;
}

export interface CustomRequest extends Request {
  user?: User;
  rawBody?: Buffer;
  session: CustomSession;
}

export type Obj = {
  [key: string]: any;
};

export type statUses = Obj & {
  read: {
    messaging_product: string;
    status: string;
    message_id: string;
    [key: string]: any;
  };
};

export interface Consumer {
  igsid: string | number;
  name?: string | undefined;
  profilePic?: any | undefined;
}

export type ReceiveProps = {
  user: Consumer;
  // webhookEvent: WebhookEventBase;
};

export type ContactsData = {
  addresses?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string | number;
    country?: string;
    country_code?: string;
    type?: string;
  }[];
  birthday?: string;
  emails?: {
    email: string;
    type?: string;
  }[];
  name: {
    formatted_name?: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    suffix?: string;
    prefix?: string;
  };
  org?: {
    company: string;
    department?: string;
    title?: string;
  };
  phones?: {
    phone: string | number;
    wa_id?: string | number;
    type?: string;
  }[];
  urls?: {
    url: string;
    type?: string;
  }[];
};

export interface IEmailService {
  id: string;
  mailListener: IMailListener;
  mailTransporter: Transporter;
}

export interface ITelegramService {
  id: string;
  telegramBot: TelegramBot;
}

export interface IInstagramService {
  id: string;
  ig: IgApiClientRealtime;
}

export interface ITelegramServiceController {
  telegramServices: ITelegramService[];
  start: (
    credentials: ITelegramCredentials
  ) => Promise<IEvents>;
  stop: (credentials: ITelegramCredentials) => Promise<IEvents>;
  resume: (credentials: ITelegramCredentials) => Promise<IEvents>;
}

export interface IEmailServiceController {
  emailServices: IEmailService[];
  start: (emailCredentials: IEmailCredentials) => any;
  stop: (id: string) => void;
  resume: (id: string) => void;
}

export interface IInstagramServiceController {
  instagramServices: IInstagramService[];
  start: (credentials: IInstagramCredentials) => any;
  // stop: (id: string) => void;
  // resume: (id: string) => void;
}

export type RegisterClient = {
  email: string;
  name: string;
  lastName?: string;
};

export interface IEmailCredentials {
  imapHost?: string;
  imapPort?: number;
  imapTls?: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  emailUsername?: string;
  emailPassword?: string;
  _id?: string;
}

export interface IInstagramCredentials {
  username: string;
  password: string;
  _id?: string;
}

export interface ITelegramCredentials {
  token: string;
  _id?: string;
}

export interface IBotData {
  companyId?: string;
  userId?: string;
  services: {
    instagram?: IInstagramCredentials;
    telegram?: ITelegramCredentials;
    email?: IEmailCredentials;
  };
}

export interface IMongoErrorHandler {
  success: boolean;
  message: string;
  error: string[] | any;
}

export interface IEvents {
  event: Events;
  message: string;
  success: boolean;
  service: string;
}

export enum Events {
  SERVICE_STARTED = "service_started",
  SERVICE_STOPPED = "service_stopped",
  SERVICE_ERROR = "service_error",
  SERVICE_ALREADY_RUNNING = "service_already_running",
  SERVICE_NOT_RUNNING = "service_not_running",
} 