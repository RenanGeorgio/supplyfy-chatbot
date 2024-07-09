//@ts-ignore
import { containerBootstrap } from "@nlpjs/core";
import { NlpManager, ConversationContext } from "node-nlp";
import { LangPt } from "@nlpjs/lang-pt";
import { BuiltinMicrosoft } from "@nlpjs/builtin-microsoft";
import { removeEmojis } from "@nlpjs/emoji";

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

type ContainerType = typeof containerBootstrap;
type ManagerType = typeof NlpManager;

let ctn = null;

(async () => {
    ctn = await containerBootstrap();
})();

const builtin = new BuiltinMicrosoft();

const loggerInstance = {
    trace: msg => console.trace(`[TRACE] ${msg}`),
    debug: msg => console.debug(`[DEBUG] ${msg}`),
    info: msg => console.info(`[INFO] ${msg}`),
    log: msg => console.log(`[LOG] ${msg}`),
    warn: msg => console.warn(`[WARN] ${msg}`),
    error: msg => console.error(`[ERROR] ${msg}`),
    fatal: msg => console.error(`[FATAL] ${msg}`),
}

export class NlpService {
    private container: ContainerType
    private manager: ManagerType

    /**
     *
     * @param {ContainerType} containerRef
     * @param {string} filename
     */
    constructor(containerRef: ContainerType, filename?: string) {
        if (!containerRef) throw new Error('[NlpService]: Missing parameter. containerRef is required');

        this.container = containerRef;
        this.container.use(LangPt);
        this.container.register('logger', loggerInstance);
        this.container.register('extract-builtin-??', builtin, true);

        this.manager = new NlpManager({ 
            container: this.container,
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
            this.loadModel(filename);
        }

        const context = new ConversationContext();  
    }

    private loadModel(fileName: string = './model.nlp'): void {
        this.manager.load(fileName);
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