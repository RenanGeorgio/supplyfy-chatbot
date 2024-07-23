import { Obj } from "../../../types";
import { ActivityProps } from "../types";

export class ContextKey {
  public activity: ActivityProps | Obj;
}

export class CurrentContext {
  public conversationId: string | number;
  public channel: string;
  public app: string;
  public from: Obj | null;
  public slotFill: string | boolean | undefined;
  public dialogStack: unknown[] | undefined;
  public validation: Obj | undefined;
  public isWaitingInput: boolean | undefined;
  public validatorName: any;
  public variableName: string | undefined;
  public validatorParameters: any;
  public errorLoops: number | undefined;
  public locale: string | undefined;
  public entities: Obj | undefined;

  [key: string]: any;

  constructor(init?: Partial<CurrentContext>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}