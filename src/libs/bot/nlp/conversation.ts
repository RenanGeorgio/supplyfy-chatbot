import { ConversationContext } from "node-nlp";
import { removeEmojis } from "@nlpjs/emoji";
import { ConversationContextType, ManagerType } from "../types";

/*
const activity = { address: { conversation: { id } } };
const context = await contextManager.getContext({ activity });
*/

export class ConversationService {
    private manager: ManagerType
    private conversationContext: ConversationContextType

    /**
     *
     * @param {ManagerType} managerRef
     */
    constructor(managerRef: ManagerType) {
        if (!managerRef) throw new Error('[ConversationService]: Missing parameter. managerRef is required');

        this.manager = managerRef;
        this.conversationContext = new ConversationContext();  
    }

    public setModel(fileName: string): void {
        this.manager.load(fileName);
    }

    public async processQuestion(pergunta: string): Promise<string> {
        const activity = {
            conversation: {
              id: 'a1'
            }
        }
    
        // const response = await manager.process({ locale: 'en', utterance: 'what is the real name of spiderman?', activity });
        const actual = removeEmojis(pergunta);
        const response: any = await this.manager.process("pt", actual, context);
    
        return response.answer || "Desculpe, não tenho uma resposta para isso.";
    }
}