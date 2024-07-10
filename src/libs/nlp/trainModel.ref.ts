//@ts-ignore
import { NlpManager, ConversationContext } from "node-nlp";

const manager = new NlpManager({ languages: ['pt'], forceNER: true, autoSave: false, nlu: { useNoneFeature: true } });
const context = new ConversationContext();
//const manager = new NlpManager({ languages: ['pt'], nlu: { useNoneFeature: false } }); // remoção da obstrução de falsos positivos, utilização de intent nao classificada

const loggerInstance = {
    trace: msg => console.trace(`[TRACE] ${msg}`),
    debug: msg => console.debug(`[DEBUG] ${msg}`),
    info: msg => console.info(`[INFO] ${msg}`),
    log: msg => console.log(`[LOG] ${msg}`),
    warn: msg => console.warn(`[WARN] ${msg}`),
    error: msg => console.error(`[ERROR] ${msg}`),
    fatal: msg => console.error(`[FATAL] ${msg}`),
}

manager.addDocument("pt", "qual a diferença do ingrow para outros aminoácidos do mercado", "agent.ingrow");
manager.addAnswer("pt", "agent.ingrow", "Nosso produto, além de ser orgânico, tem uma porcentagem de 7% de aminoácidos, distribuídos entre 19 tipos. Existe uma grande diferença de distribuição, por isso entregamos ao cliente nosso aminograma. A % de ácido glutâmico de outros aminoácidos no mercado é alta, deixando a desejar em outros aminoácidos. Isso traz um desequilíbrio para a planta. O Ingrow além de trazer mais produtividade nutrindo a planta, deixa o solo mais fértil.");
manager.addDocument("pt", "o que é o marin", "agent.marin");
manager.addAnswer("pt", "agent.marin", "A linha Marin é única no mercado, único produto que concilia 3 tipos de algas mais um blend nutricional em um mesmo produto. Adaptação das culturas a condições adversas trazendo assim uma melhor produtividade.");
manager.addDocument("pt", "porque seu aminoácido é um dos mais caro que todos do mercado", "agent.highprice");
manager.addAnswer("pt", "agent.highprice", "Produto único e exclusivo, com apenas aminoácidos orgânicos em sua composição, sem adição de aminoácidos sintéticos. Dessa forma, garante uma maior eficiência quando comparado aos demais. A planta tem mais facilidade de absorção.");
manager.addDocument("pt", "qual a diferença da sua linha de micro para outras", "agent.micro");
manager.addAnswer("pt", "agent.micro", "Além da matéria-prima de alta qualidade, toda nossa linha tem aditivo de carbono orgânico total + aminoácidos. É cientificamente provado que todo micronutriente associado a aminoácidos acelera em 10% a absorção pela planta.");
manager.addDocument("pt", "me diga sobre você", "agent.acquaintance");
manager.addDocument("pt", "o que você faz aqui", "agent.acquaintance");
manager.addDocument("pt", "descreva você", "agent.acquaintance");
manager.addDocument("pt", "o que você é", "agent.acquaintance");
manager.addDocument("pt", "quem é você", "agent.acquaintance");
manager.addDocument("pt", "quero saber mais sobre você", "agent.acquaintance");
manager.addDocument("pt", "fale sobre você", "agent.acquaintance");
manager.addAnswer("pt", "agent.acquaintance", "Sou um ser virtual à serviço da Ambios.");
manager.addDocument("pt", "qual a sua idade", "agent.age");
manager.addAnswer("pt", "agent.age", "Nascemos em 2018.");
manager.addDocument("pt", "eu te odeio", "agent.bad");
manager.addDocument("pt", "você é horrível", "agent.bad");
manager.addDocument("pt", "você é inútil", "agent.bad");
manager.addAnswer("pt", "agent.bad", "Me desculpe, tentarei melhorar com este feedback.");
manager.addDocument("pt", "você é legal", "agent.beautiful");
manager.addDocument("pt", "você é fantástica", "agent.beautiful");
manager.addAnswer("pt", "agent.beautiful", "Obrigado, estamos aqui para te ajudar.");
manager.addDocument("pt", "você pode me ajudar", "agent.canyouhelp");
manager.addDocument("pt", "preciso de ajuda", "agent.canyouhelp");
manager.addDocument("pt", "preciso que você me ajude", "agent.canyouhelp");
manager.addAnswer("pt", "agent.canyouhelp", "Estaremos feliz se pudermos ajudar você!");
manager.addAnswer("pt", "agent.canyouhelp", "O que posso fazer por você?");
manager.addDocument("pt", "você é um bot", "agent.chatbot");
manager.addDocument("pt", "você é apenas um bot", "agent.chatbot");
manager.addDocument("pt", "você é um chatbot", "agent.chatbot");
manager.addDocument("pt", "você é um robô", "agent.chatbot");
manager.addDocument("pt", "você é um programa", "agent.chatbot");
manager.addAnswer("pt", "agent.chatbot", "Sim, sou um chatbot.");
manager.addAnswer("pt", "agent.chatbot", "Sou um chatbot com propósito de te ajudar.");
manager.addDocument("pt", "onde você trabalha", "agent.occupation");
manager.addDocument("pt", "onde é a sua localização", "agent.occupation");
manager.addDocument("pt", "de onde você é", "agent.occupation");
manager.addDocument("pt", "de onde você veio", "agent.occupation");
manager.addDocument("pt", "onde você nasceu", "agent.occupation");
manager.addAnswer("pt", "agent.occupation", "Somos uma empresa de Juscimeira-MT.");
manager.addDocument("pt", "voce é real", "agent.real");
manager.addDocument("pt", "você é uma pessoa real", "agent.real");
manager.addDocument("pt", "você não é real", "agent.real");
manager.addDocument("pt", "Penso que você é real", "agent.real");
manager.addAnswer("pt", "agent.real", "Eu não sou uma pessoa real.");
manager.addDocument("pt", "você tem certeza disso", "agent.sure");
manager.addDocument("pt", "você tem certeza", "agent.sure");
manager.addAnswer("pt", "agent.sure", "Sim");
manager.addAnswer("pt", "agent.sure", "Com certeza");
manager.addDocument("pt", "fale comigo", "agent.talktome");
manager.addDocument("pt", "você pode conversar comigo", "agent.talktome");
manager.addAnswer("pt", "agent.talktome", "Com certeza, vamos conversar.");
manager.addDocument("pt", "você está aí", "agent.there");
manager.addDocument("pt", "você ainda está aí", "agent.there");
manager.addAnswer("pt", "agent.there", "Claro, eu sempre estarei aqui.");
manager.addDocument("pt", "sem problemas", "appraisal.noproblem");
manager.addDocument("pt", "não se preocupe", "appraisal.noproblem");
manager.addDocument("pt", "não se preocupe com isso", "appraisal.noproblem");
manager.addAnswer("pt", "appraisal.noproblem", "Obrigado!");
manager.addDocument("pt", "muito obrigado", "appraisal.thankyou");
manager.addDocument("pt", "obrigado", "appraisal.thankyou");
manager.addAnswer("pt", "appraisal.thankyou", "É um prazer te ajudar.");
manager.addDocument("pt", "bom trabalho", "appraisal.welldone");
manager.addDocument("pt", "bem feito", "appraisal.welldone");
manager.addDocument("pt", "excelente trabalho", "appraisal.welldone");
manager.addAnswer("pt", "appraisal.welldone", "É um prazer poder te ajudar.");
manager.addDocument("pt", "espere", "dialog.holdon");
manager.addDocument("pt", "espere, por favor", "dialog.holdon");
manager.addAnswer("pt", "dialog.holdon", "Eu estarei esperando.");
manager.addAnswer("pt", "dialog.holdon", "Eu estou sempre aqui.");
manager.addDocument("pt", "me desculpe", "dialog.sorry");
manager.addDocument("pt", "me perdoe", "dialog.sorry");
manager.addAnswer("pt", "dialog.sorry", "Tudo bem, não se preocupe.");
manager.addDocument("pt", "tchau", "greetings.bye");
manager.addDocument("pt", "até mais", "greetings.bye");
manager.addDocument("pt", "tenho que ir", "greetings.bye");
manager.addAnswer("pt", "greetings.bye", "Até a próxima!");
manager.addAnswer("pt", "greetings.bye", "Volte sempre.");
manager.addDocument("pt", "olá", "greetings.hello");
manager.addDocument("pt", "oi", "greetings.hello");
manager.addAnswer("pt", "greetings.hello", "Olá, em que posso ajudá-lo?");
manager.addDocument("pt", "como está seu dia", "greetings.howareyou");
manager.addDocument("pt", "como você está", "greetings.howareyou");
manager.addDocument("pt", "está tudo bem", "greetings.howareyou");
manager.addAnswer("pt", "greetings.howareyou", "Maravilhoso! Obrigado por perguntar.");
manager.addDocument("pt", "aqui estou de volta", "user.back");
manager.addDocument("pt", "estou de volta", "user.back");
manager.addAnswer("pt", "user.back", "Bem vindo de volta, o que posso fazer para te ajudar?");
manager.addAnswer("pt", "user.back", "Bom te ver de volta, em que posso ajudá-lo?");

(async () => {
    await manager.train();
    // manager.save();
})();

export async function processQuestion(pergunta: string): Promise<string> {
    const container = await containerBootstrap();
    container.use(LangPt);
    container.register('logger', loggerInstance);

    const activity = {
        conversation: {
          id: 'a1'
        }
    }

    const manager = new NlpManager({
        container,
        locales: ['en', 'es'],
        trainByDomain: true,
    });
    // const response = await manager.process({ locale: 'en', utterance: 'what is the real name of spiderman?', activity });
    //const response: any = await manager.process("pt", pergunta, context);
    const response: any = await manager.process("pt", pergunta);

    return response.answer || "Desculpe, não tenho uma resposta para isso.";
}