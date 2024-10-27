import { RecognizerResult } from "botbuilder";
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
   * @param {string} text
   */
  public async executeLuisQuery(text: string): Promise<RecognizerResult> {
    // trocar para nlubrain dentro do nlpmanager
    const classifications = await this.recognizer.process("pt", text);
    console.log(classifications)
    return classifications
  }
}