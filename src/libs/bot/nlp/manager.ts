import { NlpManager } from "node-nlp";
import { ConversationService } from "./conversation";
import { ContextKey } from "../data";
import { ContainerType, ContextManagerType, ContextMap, ExtendedConversationContextType, ManagerType, NluManagerType } from "../types";
import { Obj } from "../../../types";


type ConversationDict = {
    conversation: ConversationService
    userId: string
}

export class NlpService {
    private manager: ManagerType
    private nluManager: NluManagerType
    private contextManager: ContextManagerType
    private conversations: ConversationDict[]
    private options: Obj

    /**
     *
     * @param {ContainerType} containerRef
     * @param {string} filename
     */
    constructor(containerRef: ContainerType, filename?: string) {
        if (!containerRef) {
            throw new Error('[NlpService]: Missing parameter. containerRef is required');
        }

        this.contextManager = containerRef.get('context-manager');

        this.options = {
            container: containerRef,
            languages: ['pt'], 
            forceNER: true, 
            autoSave: false,
            //fullSearchWhenGuessed: true,
            //useNlg: true,
            nlu: {
                spellCheck: true, 
                //useNoneFeature: true // remoção da obstrução de falsos positivos, utilização de intent nao classificada
            },
            ner: { builtins: [] }
        }

        this.manager = new NlpManager(this.options);

        if (filename) {
            try {
                this.loadModel(filename);
            } catch (err) {
                console.log(err);
            }
        }

        this.nluManager = containerRef.get('nlu-manager', containerRef.getConfiguration('nlu-manager'));

        this.conversations = [];
    }

    private loadModel(fileName: string = './model.nlp'): void {
        this.manager.load(fileName);
    }

    public setModel(fileName: string): void {
        this.manager.load(fileName);
    }

    public getNluManager(): NluManagerType {
        return this.nluManager;
    }

    private getOptionsSettings(): Obj {
        return this.options;
    }

    private getConversationById(id: string): ConversationService | null {
        const conversationObj: ConversationDict | undefined = this.conversations.find(convo => convo.userId === id);
        
        if (conversationObj?.conversation) {
            return conversationObj.conversation;
        } else {
            return null;
        }
    }

    public updateConversationProperty(id: string, key: string, value: any): void {
        const conversation: ConversationService | null = this.getConversationById(id);

        if (conversation) {
            conversation.updateProperty(key, value);
        }
    }

    public async executeConversation(id: string, question: string): Promise<string> {
        const conversation: ConversationService | null = this.getConversationById(id);

        if (conversation == null) {
            return "Desculpe, não tenho uma resposta para isso.";
        }
        
        const { answer, activity } = await conversation?.processQuestion(question);

        const actual = await this.contextManager.getContext(activity); // TO-DO: Ver se muda
        this.updateConversationProperty(id, 'contextValue', actual);

        return answer;
    }

    public async createConversation(id: string, userId: string): Promise<void> {
        const currentConversation = new ConversationService(this.manager, id, this.getOptionsSettings());
        const currentContextMap: ContextMap = currentConversation?.getCurrentConversation();
        
        if (!currentContextMap) {
            return;
        }

        const currentActivity: ContextKey | undefined | null = currentContextMap?.contextKey;
        const currentContext: ExtendedConversationContextType = currentContextMap?.conversationContext;
        
        await this.contextManager.setContext({ currentActivity }, currentContext);

        const actual = await this.contextManager.getContext(currentActivity);

        currentConversation.updateContextMap(actual);

        const conversation: ConversationDict = {
            conversation: currentConversation,
            userId: userId,
        }

        this.conversations.push(conversation);
    }

    public async deleteConversation(id: string, userId: string): Promise<void> {
        await this.contextManager.resetConversation(id);

        const index = this.conversations.findIndex(convo => convo.userId === userId);
        if (index !== -1) {
            const conversation = this.conversations[index].conversation;
            if (conversation) {
                conversation.cleanup();
            }
            
            this.conversations.splice(index, 1);
        }
    }
}