import { ContextKey, CurrentContext } from "../data";
import { CurrentConversationContext } from "../packages";
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
        this.contextMap.conversationContext = new CurrentConversationContext();
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

    public async processQuestion(question: string): Promise<string> {
        const activity = this.contextMap.contextKey;
        const context = this.contextMap.conversationContext;
    
        // const response = await manager.process({ locale: 'en', utterance: 'what is the real name of spiderman?', activity });
        const response: any = await this.manager.process("pt", question, context);
    
        return response.answer || "Desculpe, não tenho uma resposta para isso.";
    }

    public cleanup() {
        for (let key in this.contextMap) {
            if (this.contextMap[key] && typeof this.contextMap[key].close === 'function') {
                this.contextMap[key]?.close();
            }

            delete this.contextMap[key];
        }
    }
}