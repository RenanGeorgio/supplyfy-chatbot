import { NlpManager } from "node-nlp";
import { ContainerType, ManagerType } from "./types";

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
            try {
                this.loadModel(filename);
            } catch (err) {
                console.log(err);
            }
        }
    }

    private loadModel(fileName: string = './model.nlp'): void {
        this.manager.load(fileName);
    }

    public setModel(fileName: string): void {
        this.manager.load(fileName);
    }
}