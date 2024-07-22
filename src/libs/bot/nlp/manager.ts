import { NlpManager } from "node-nlp";
import { ConversationService } from "./conversation";
import { ContainerType, ContextManagerType, ManagerType, NluManagerType } from "../types";
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
        if (!containerRef) throw new Error('[NlpService]: Missing parameter. containerRef is required');

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

    getConversationById(id: string): ConversationService | null {
        const conversationObj: ConversationDict | undefined = this.conversations.find(convo => convo.userId === id);
        
        if (conversationObj?.conversation) {
            return conversationObj.conversation;
        } else {
            return null;
        }
    }

    updateConversationProperty(id: string, key: string, value: any): void {
        const conversation: ConversationService | null = this.getConversationById(id);

        if (conversation) {
            conversation.updateProperty(key, value);
        }
    }

    createConversation(id: string): void {
        const conversation: ConversationDict = {
            conversation: new ConversationService(this.manager),
            userId: id,
        }

        this.conversations.push(conversation);
    }

    deleteConversation(id: string): void {
        const index = this.conversations.findIndex(convo => convo.userId === id);
        if (index !== -1) {
            const conversation = this.conversations[index].conversation;
            if (conversation) {
                conversation.cleanup();
            }
            
            this.conversations.splice(index, 1);
        }
    }
}