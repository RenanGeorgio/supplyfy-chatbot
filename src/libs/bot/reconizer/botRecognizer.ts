import { RecognizerResult, TurnContext } from "botbuilder";
import { ManagerType } from "../types";

export class BotRecognizer {
  private recognizer: ManagerType

  constructor(manager: ManagerType) {  
    this.recognizer = manager;
  }

  public get isConfigured(): boolean {
    return (this.recognizer !== undefined);
  }

  /**
   * @param {TurnContext} context
   */
  public async executeLuisQuery(context: TurnContext): Promise<RecognizerResult> {
    // trocar para nlubrain dentro do nlpmanager
    const classifications = await this.recognizer.process('pt', context.activity.text);
    console.log(classifications)
    return classifications
  }
}