import instagramLogin from "./auth/session";
import intagramService from "./instagram";
import { IInstagramServiceController } from "../../types";
import { findBot, removeBot } from "../../helpers/findBot";
import { Events } from "../../types/types";

export const instagramServiceController: IInstagramServiceController = {
  instagramServices: [],

  async start(igCredentials, webhook) {
    const id = igCredentials._id?.toString()!;
    const service = findBot(id, this.instagramServices);

    if (service) {
      return {
        success: false,
        event: Events.SERVICE_ALREADY_RUNNING,
        service: "instagram",
        message: "serviço já está rodando",
      };
    }

    const session = await instagramLogin({
      username: igCredentials.username,
      password: igCredentials.password,
    });

    if (session?.success === false) {
      return session;
    }

    if (session?.ig) {
      const { ig } = session;
      const { igClient } = await intagramService(ig!, webhook);

      this.instagramServices.push({
        id,
        ig: igClient,
      });

      return {
        success: true,
        event: Events.SERVICE_STARTED,
        service: "instagram",
        message: "serviço iniciado",
      };
    } else {
      return {
        success: false,
        event: Events.SERVICE_ERROR,
        service: "instagram",
        message: "não autorizado",
      };
    }
  },
  async stop(credentials) {
    const id = credentials._id?.toString()!;
    const bot = findBot(id, this.instagramServices);

    if (bot) {
      bot.ig.realtime.disconnect();
      bot.ig.destroy();
      removeBot(bot, this.instagramServices);
      return {
        success: true,
        event: Events.SERVICE_STOPPED,
        service: "instagram",
        message: "serviço parado",
      };
    }

    return {
      success: false,
      event: Events.SERVICE_NOT_RUNNING,
      service: "instagram",
      message: "serviço não está rodando",
    };
  },
};
