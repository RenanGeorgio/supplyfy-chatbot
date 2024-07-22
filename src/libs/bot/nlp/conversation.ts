import { ConversationContext } from "node-nlp";
import { removeEmojis } from "@nlpjs/emoji";
import { ContextMap, ManagerType } from "../types";
import { ContextKey, CurrentContext } from "../data";

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

    updateProperty(key: string, value: any): void {
        this.otherObjects[key] = value;
    }

    releaseResources() {
        for (let key in this.resources) {
            if (this.resources[key] && typeof this.resources[key].close === 'function') {
                this.resources[key].close(); // Assuming resources have a close method
            }
            delete this.resources[key];
        }
    }

    cleanup() {
        this.releaseResources();
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