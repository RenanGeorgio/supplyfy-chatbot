import { ConversationContext } from "node-nlp";
import { removeEmojis } from "@nlpjs/emoji";
import { ContextKey, CurrentContext } from "../data";
import { ContextMap, ManagerType } from "../types";

/*
const activity = { address: { conversation: { id } } };
const context = await contextManager.getContext({ activity });
*/

export class ConversationService {
    private manager: ManagerType
    private contextMap: ContextMap

    /**
     *
     * @param {ManagerType} managerRef
     * @param {string} conversationId
     */
    constructor(managerRef: ManagerType, conversationId: string | number) {
        if (!managerRef) throw new Error('[ConversationService]: Missing parameter. managerRef is required');
        if (!conversationId) throw new Error('[ConversationService]: Missing parameter. conversationId is required');

        this.manager = managerRef; 

        const contextKey = new ContextKey();
        contextKey.activity = {
            conversation: { 
                id: conversationId
            }
        }
        
        this.init(contextKey);
    }

    private init(key: ContextKey): void {
        this.contextMap.contextKey = key;
        this.contextMap.conversationContext = new ConversationContext();
    }

    public setCurrentConversation(): ContextMap {
        return this.contextMap;
    }

    public updateContextMap(value: CurrentContext): void {
        this.contextMap.contextValue = value;
    }

    public setModel(fileName: string): void {
        this.manager.load(fileName);
    }

    public updateProperty(key: string, value: any): void {
        this.contextMap[key] = value;
    }

    public cleanup() {
        for (let key in this.contextMap) {
            if (this.contextMap[key] && typeof this.contextMap[key].close === 'function') {
                this.contextMap[key]?.close();
            }

            delete this.contextMap[key];
        }
    }

    public async processQuestion(pergunta: string): Promise<string> {
        const context = await this.contextManager.getContext(session);
        const activity = {
            conversation: {
              id: 'a1' // settings.conversationId,
            }
        }
    
        // const response = await manager.process({ locale: 'en', utterance: 'what is the real name of spiderman?', activity });
        const actual = removeEmojis(pergunta);
        const response: any = await this.manager.process("pt", actual, context);
    
        return response.answer || "Desculpe, não tenho uma resposta para isso.";
    }
}