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
    async handle({ data }) {
       const message = data.result
        await botService(message);
    },
    options: {
        attempts: 3,
        backoff: 2000,
        removeOnComplete: true,
    },
};