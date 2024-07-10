import { containerBootstrap } from "@nlpjs/core";
import { NlpManager, ConversationContext } from "node-nlp";
import { NluManager } from "@nlpjs/nlu";

export type ContainerType = typeof containerBootstrap;

export type ManagerType = typeof NlpManager;

export type NluManagerType = typeof NluManager;

export type ConversationContextType = typeof ConversationContext;