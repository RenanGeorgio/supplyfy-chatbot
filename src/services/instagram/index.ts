import instagramLogin from "./auth/session";
import intagramService from "./instagram";
import { IInstagramServiceController } from "../../types";
import { findBot } from "../../helpers/findBot";
import { Events } from "../../types/types";

export const instagramServiceController: IInstagramServiceController = {
  instagramServices: [],

  async start(igCredentials) {
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
      const { igClient } = await intagramService(ig!);

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
        Events: Events.SERVICE_ERROR,
        service: "instagram",
        message: "não autorizado",
      };
    }
  },
};
