import { messengerServiceController } from ".";
import messengerService from "./messengerService";

export default {
  key: "MessengerService",
  async handle({ data }) {
    const { id, messages } = data;

    const service = messengerServiceController.mensengerServices.find(
      (service: any) => service.pageId === id
    );

    await messengerService({ credentials: service, messages });
  },
  options: {
    attempts: 3,
    backoff: 2000,
    removeOnComplete: true,
  },
};
