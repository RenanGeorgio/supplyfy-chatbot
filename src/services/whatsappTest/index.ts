import { findBot, removeBot } from "../../helpers/findBot";
import { Events } from "../../types/enums";

export const whatsappServiceController: any = {
  whatsappServices: [],

  async start(credentials) {
    const id = credentials._id.toString();
    console.log(id)
    const service = findBot(id, this.whatsappServices);

    if (service) {
      return {
        success: false,
        event: Events.SERVICE_ALREADY_RUNNING,
        service: "whatsapp",
        message: "serviço já está rodando",
      };
    }

    this.whatsappServices.push(credentials);
    
    return {
      success: true,
      event: Events.SERVICE_STARTED,
      service: "whatsapp",
      message: "serviço iniciado",
    };
  },

  async stop(credentials) {
    const id = credentials._id.toString();
    const service = findBot(id, this.whatsappServices);

    if (!service) {
      return {
        success: false,
        event: Events.SERVICE_NOT_RUNNING,
        service: "whatsapp",
        message: "serviço não está rodando",
      };
    }

    removeBot(service, this.whatsappServices);

    return {
      success: true,
      event: Events.SERVICE_STOPPED,
      service: "whatsapp",
      message: "serviço parado",
    };
  }
};