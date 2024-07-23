import { ConversationContext } from "node-nlp";
import { ContextKey, CurrentContext } from "../data";
//import { CurrentConversationContext } from "../packages";
import { ContextMap, ManagerType, ExtendedConversationContextType } from "../types";
import { Obj } from "../../../types";

export class ConversationService {
    private manager: ManagerType;
    private contextMap: ContextMap;
    private settings: Obj | undefined;

    /**
     *
     * @param {ManagerType} managerRef
     * @param {string} conversationId
     */
    constructor(managerRef: ManagerType, conversationId: string | number, options?: Obj) {
        if (!managerRef) throw new Error('[ConversationService]: Missing parameter. managerRef is required');
        if (!conversationId) throw new Error('[ConversationService]: Missing parameter. conversationId is required');

        this.manager = managerRef; 
        this.settings = options || undefined;
        this.contextMap = {};

        const contextKey = new ContextKey();
        contextKey.activity = {
            conversation: { 
                id: conversationId
            }
        }
        
        this.optimazeSettings(contextKey);
        this.init(contextKey);
    }

    private init(key: ContextKey): void {
        this.contextMap.contextKey = key;
        this.contextMap.conversationContext = new ConversationContext(); // CurrentConversationContext()
    }

    private optimazeSettings(key: ContextKey): void {
        if (this.settings) {
            this.settings['activity'] = key.activity;
        }
    }

    public getCurrentConversation(): ContextMap {
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
        const context: ExtendedConversationContextType = this.contextMap.conversationContext;
    
        // const response = await manager.process({ locale: 'en', utterance: 'what is the real name of spiderman?', activity });
        const response: any = await this.manager.process("pt", question, context, this.settings);
    
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