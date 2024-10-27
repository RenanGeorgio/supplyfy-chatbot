import { containerBootstrap } from "@nlpjs/core";
import { LangPt } from "@nlpjs/lang-pt";
import { BuiltinMicrosoft } from "@nlpjs/builtin-microsoft";
import { Ner } from "@nlpjs/ner";
import { ContextManager } from "@nlpjs/nlp";
import { NlpService } from "./nlp/manager";
import { BotService } from "./init";
import { ConversationBot } from "./conversation/bot";
import { ContainerType } from "./types";


let builtin: BuiltinMicrosoft;
let contextManager: ContextManager;

const loggerInstance = {
  trace: (msg: string) => console.trace(`[TRACE] ${msg}`),
  debug: (msg: string) => console.debug(`[DEBUG] ${msg}`),
  info: (msg: string) => console.info(`[INFO] ${msg}`),
  log: (msg: string) => console.log(`[LOG] ${msg}`),
  warn: (msg: string) => console.warn(`[WARN] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  fatal: (msg: string) => console.error(`[FATAL] ${msg}`),
}

export class ContainerService {
  private container: ContainerType;
  private managerService: NlpService | undefined;
  private conversationBot: ConversationBot | undefined;

  private static _instance: ContainerService;

  private constructor() {
    builtin = new BuiltinMicrosoft();
    contextManager = new ContextManager();
  }

  private async build(): Promise<void> {
    this.container = await containerBootstrap();

    this.container.use(LangPt);
    this.container.use(Ner); // TODO: Verificar se a chamada deste trecho esta correta

    this.container.registerConfiguration('context-manager', {
      tableName: 'context'
    });

    this.container.register('logger', loggerInstance);
    this.container.register('extract-builtin-??', builtin, true);
    this.container.register('context-manager', contextManager, true);

    this.managerService = new NlpService(this.container, 'model_1.nlp');
    this.conversationBot = new BotService(this.managerService).getBot()  
  }

  public getConversationBot(): ConversationBot{
    if (!this.conversationBot) throw new Error('[ContainerService]: Bot didn\'t initialize.');
    return this.conversationBot;
  }

  public static async getInstance(): Promise<ContainerService> {
    if (this._instance) {
      return this._instance;
    }
 
    this._instance = new ContainerService();
    await this._instance.build();
    return this._instance;
  }
}