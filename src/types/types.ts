import { Request } from "express";
import { Types } from "mongoose";
// import { WebhookEventBase } from "./meta";
import { Session } from "express-session";
import TelegramBot from "node-telegram-bot-api";

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
}

export type statUses = Obj & {
    read: {
        messaging_product: string;
        status: string;
        message_id: string;
        [key: string]: any;
    }
}

export interface Consumer {
    igsid: string | number;
    name?: string | undefined;
    profilePic?: any | undefined;
};

export type ReceiveProps = {
    user: Consumer;
    // webhookEvent: WebhookEventBase;
}

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
}

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

export interface IEmailService {
    imapHost?: string;
    imapPort?: number;
    smtpHost?: string;
    smtpPort?: number;
    emailUsername?: string;
    emailPassword?: string;
    secure: boolean;
}