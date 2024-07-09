//@ts-ignore
import { containerBootstrap } from "@nlpjs/core";
import { LangPt } from "@nlpjs/lang-pt";
import { BuiltinMicrosoft } from "@nlpjs/builtin-microsoft";

type ContainerType = typeof containerBootstrap;

const builtin = new BuiltinMicrosoft();

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

  constructor() {
    this.init();
  }

  private async init() {
    this.container = await containerBootstrap();
    this.container.use(LangPt);
    this.container.register('logger', loggerInstance);
    this.container.register('extract-builtin-??', builtin, true);
  }
}