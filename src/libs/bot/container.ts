import { containerBootstrap } from "@nlpjs/core";
import { LangPt } from "@nlpjs/lang-pt";
import { BuiltinMicrosoft } from "@nlpjs/builtin-microsoft";
import { Ner } from "@nlpjs/ner";
import { ContextManager } from "@nlpjs/nlp";
import { ContainerType } from "./nlp/types";

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
  }

  static getInstance(): ContainerService {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new ContainerService();
    return this._instance;
  }
}