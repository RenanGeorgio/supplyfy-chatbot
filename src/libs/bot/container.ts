import { containerBootstrap } from "@nlpjs/core";
import { LangPt } from "@nlpjs/lang-pt";
import { BuiltinMicrosoft } from "@nlpjs/builtin-microsoft";
import { Ner } from "@nlpjs/ner";
import { ContextManager } from "@nlpjs/nlp";
import { NlpService } from "./nlp/manager";
import { ContainerType, ManagerType } from "./types";

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
  private container: ContainerType
  private managerService: ManagerType
  static _instance: ContainerService;

  constructor() {
    builtin = new BuiltinMicrosoft();
    contextManager = new ContextManager();
    this.init();
  }

  private async init(): Promise<void> {
    this.container = await containerBootstrap();
    this.container.use(LangPt);
    this.container.use(Ner);
    this.container.registerConfiguration('context-manager', {
      tableName: 'context'
    });
    this.container.register('logger', loggerInstance);
    this.container.register('extract-builtin-??', builtin, true);
    this.container.register('context-manager', contextManager, true);
    this.managerService = new NlpService(this.container);
  }

  public getManager(): ManagerType {
    return this.managerService
  }

  public getContainer(): ContainerType {
    return this.container
  }

  static getInstance(): ContainerService {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new ContainerService();
    return this._instance;
  }
}