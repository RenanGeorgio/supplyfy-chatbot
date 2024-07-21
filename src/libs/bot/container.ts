import { containerBootstrap } from "@nlpjs/core";
import { LangPt } from "@nlpjs/lang-pt";
import { BuiltinMicrosoft } from "@nlpjs/builtin-microsoft";
import { Ner } from "@nlpjs/ner";
import { ContextManager } from "@nlpjs/nlp";
import { ContainerType } from "./types";
import { NlpService } from "./nlp/manager";
import { BotService } from "./init";
import { ConversationBot } from "./conversation/bot";

let builtin;
let contextManager;

const loggerInstance = {
  trace: msg => console.trace(`[TRACE] ${msg}`),
  debug: msg => console.debug(`[DEBUG] ${msg}`),
  info: msg => console.info(`[INFO] ${msg}`),
  log: msg => console.log(`[LOG] ${msg}`),
  warn: msg => console.warn(`[WARN] ${msg}`),
  error: msg => console.error(`[ERROR] ${msg}`),
  fatal: msg => console.error(`[FATAL] ${msg}`),
}

export class ContainerService {
  private container: ContainerType
  private managerService: any
  private conversationBot: any
  
  static _instance: ContainerService;

  constructor() {
    builtin = new BuiltinMicrosoft();
    contextManager = new ContextManager();

    this.init();
  }

  private async init(): Promise<void> {
    this.container = await containerBootstrap();

    this.container.use(LangPt);
    this.container.use(Ner); // TODO: Verificar se a chamada deste trecho esta correta

    this.container.registerConfiguration('context-manager', {
      tableName: 'context'
    });

    this.container.register('logger', loggerInstance);
    this.container.register('extract-builtin-??', builtin, true);
    this.container.register('context-manager', contextManager, true);

    this.managerService = new NlpService(this.container);

    this.conversationBot = new BotService(this.managerService.getNluManager()).getBot();
  }

  public getConversationBot(): ConversationBot {
    return this.conversationBot;
  }

  static getInstance(): ContainerService {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new ContainerService();
    return this._instance;
  }
}