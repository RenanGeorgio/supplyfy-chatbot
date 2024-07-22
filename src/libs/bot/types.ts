import { containerBootstrap } from "@nlpjs/core";
import { NlpManager, ConversationContext } from "node-nlp";
import { NluManager } from "@nlpjs/nlu";
import { ContextManager } from "@nlpjs/nlp";

export type ContainerType = typeof containerBootstrap;

export type ManagerType = typeof NlpManager;

export type NluManagerType = typeof NluManager;

export type ConversationContextType = typeof ConversationContext;

export type ContextManagerType = typeof ContextManager;

export type AttachmentLayout = "list" | "carousel";

export type UserRole = "bot" | "channel" | "user";

export interface IActivity {
  type: string,
  channelData?: any,
  channelId?: string,
  conversation?: { id: string },
  eTag?: string,
  from: User,
  id?: string,
  timestamp?: string
}

export interface Message extends IActivity {
  type: "message",
  text?: string,
  locale?: string,
  textFormat?: "plain" | "markdown" | "xml",
  attachmentLayout?: AttachmentLayout,
  attachments?: any[],
  entities?: any[],
  suggestedActions?: { actions: any[], to?: string[] },
  speak?: string,
  inputHint?: string,
  value?: object
}

export interface User {
  id: string,
  name?: string,
  iconUrl?: string,
  role?: UserRole
}