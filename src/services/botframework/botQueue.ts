import botService from "./botService";

export const botServiceController: any = {
    botServices: [],

    async start() {
        
    },

    async stop() {
        
    }
};


export default {
    key: "BotService",
    async handle(data: any) {
        const message = data;
        await botService({ message });
    },
    options: {
        attempts: 3,
        backoff: 2000,
        removeOnComplete: true,
    },
};
