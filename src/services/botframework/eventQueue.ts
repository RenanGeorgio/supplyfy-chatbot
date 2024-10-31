import eventService from "./eventService";

export const eventServiceController: any = {
    eventServices: [],
    async start() {
    },
    async stop() {
    }
};

export default {
    key: "EventService",
    async handle(data: any) {
        const result = data;
        await eventService({ result });
    },
    options: {
        attempts: 3,
        backoff: 2000,
        removeOnComplete: true,
    },
};