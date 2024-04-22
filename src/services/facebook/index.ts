import { findBot, removeBot } from "../../helpers/findBot";
import Queue from "../../libs/Queue";
import { Events } from "../../types/types";
import messengerService from "./messengerService";

export const messengerServiceController: any = {
  mensengerServices: [],

  async start(credentials) {
    const id = credentials._id.toString();

    const service = findBot(id, this.mensengerServices);

    if (service) {
      return {
        success: false,
        event: Events.SERVICE_ALREADY_RUNNING,
        service: "facebook",
        message: "serviço já está rodando",
      };
    }

    this.mensengerServices.push(credentials);

    return {
      success: true,
      event: Events.SERVICE_STARTED,
      service: "facebook",
      message: "serviço iniciado",
    };
  },

  async stop(credentials) {
    const id = credentials._id.toString();
    const service = findBot(id, this.mensengerServices);

    if (!service) {
      return {
        success: false,
        event: Events.SERVICE_NOT_RUNNING,
        service: "facebook",
        message: "serviço não está rodando",
      };
    }

    removeBot(service, this.mensengerServices);

    return {
      success: true,
      event: Events.SERVICE_STOPPED,
      service: "facebook",
      message: "serviço parado",
    };
  },

  async sendMessage({ id, messages }) {
    const service = this.mensengerServices.find(
      (service: any) => service.pageId === id
    );

    if (!service) {
      return {
        success: false,
        event: Events.SERVICE_NOT_RUNNING,
        service: "facebook",
        message: "serviço não está rodando",
      };
    }

    // await messengerService.handle({ credentials: service, messages });
    await Queue.add("MessengerService", { credentials: service, messages });
  },
};
