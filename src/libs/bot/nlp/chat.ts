import { ConversationContext } from "node-nlp";
import { ConversationContextType, ManagerType } from "../types";

export class ChatService {
    private manager: ManagerType
    private conversationContext: ConversationContextType

    /**
     *
     * @param {ManagerType} managerRef
     */
    constructor(managerRef: ManagerType) {
        if (!managerRef) {
            throw new Error('[ChatService]: Missing parameter. managerRef is required');
        }
        
        this.manager = managerRef;
        this.conversationContext = new ConversationContext();  
    }
}