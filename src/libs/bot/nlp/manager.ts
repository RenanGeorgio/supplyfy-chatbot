import { NlpManager } from "node-nlp";
import { ContainerType, ContextManagerType, ManagerType } from "../types";
import { ConversationService } from "./conversation";
import { ChatService } from "./chat";

/*
test('Should classify an utterance without None feature', async () => {
      const manager = new NlpManager({ nlu: { useNoneFeature: false } });
      addFrJp(manager);
      await manager.train();
      const result = await manager.classify('fr', 'où sont mes clés');
      expect(result.classifications).toHaveLength(2);
      expect(result.intent).toEqual('keys');
      expect(result.score).toBeGreaterThan(0.7);
    });
*/

export class NlpService {
    private manager: ManagerType
    private contextManager: ContextManagerType
    private chat: ConversationService

    static _instance: NlpService; // TALVEZ ???

    /**
     *
     * @param {ContainerType} containerRef
     * @param {string} filename
     */
    constructor(containerRef: ContainerType, filename?: string) {
        if (!containerRef) throw new Error('[NlpService]: Missing parameter. containerRef is required');

        this.contextManager = containerRef.get('context-manager');

        this.manager = new NlpManager({ 
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
        });

        if (filename) {
            try {
                this.loadModel(filename);
            } catch (err) {
                console.log(err);
            }
        }

        this.chat = new ChatService(this.manager);
    }

    private loadModel(fileName: string = './model.nlp'): void {
        this.manager.load(fileName);
    }

    public setModel(fileName: string): void {
        this.manager.load(fileName);
    }

    static getInstance(): NlpService {
        if (this._instance) {
          return this._instance;
        }
    
        this._instance = new NlpService();
        return this._instance;
      }
}