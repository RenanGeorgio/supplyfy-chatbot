import { RecognizerResult, TurnContext } from "botbuilder";
import { NluManagerType } from "../types";

export class BotRecognizer {
  private recognizer: NluManagerType

  constructor(manager: NluManagerType) {  
    this.recognizer = manager;
  }

  public get isConfigured(): boolean {
    return (this.recognizer !== undefined);
  }

  /**
   * @param {TurnContext} context
   */
  public async executeLuisQuery(context: TurnContext): Promise<RecognizerResult> {
    return this.recognizer.recognize(context); // TO-DO: qual classe usar
  }
}