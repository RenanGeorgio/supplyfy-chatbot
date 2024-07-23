import { MemoryConversationContext } from "node-nlp";
import { CurrentContext } from "../data";
import { Obj } from "../../../types";

export class CurrentConversationContext extends MemoryConversationContext {
  private conversationContexts: Obj
  /**
   * Constructor of the class.
   * @param {Object} settings Settings for the instance.
   */
  constructor(settings = {}) {
    super(settings);
    this.conversationContexts = new CurrentContext();
  }

  addNewProperty(srcobj: Obj): void {
    Object.keys(srcobj).forEach((key) => {
      if (this.conversationContexts[key] === undefined) {
        this.conversationContexts[key] = srcobj[key];
      }
    });
  }
}