
import instagramLogin from "./auth/session";
import intagramService from "./instagram";
import { IInstagramServiceController } from "../../types";
import { findBot } from "../../helpers/findBot";

export const instagramServiceController: IInstagramServiceController = {
  instagramServices: [],

  async start(igCredentials) {
    const id = igCredentials._id?.toString()!;
    const service = findBot(id, this.instagramServices);

    if(service) {
      return { success: false, message: "Bot já está rodando" };
    }

    const session = await instagramLogin({
      username: igCredentials.username,
      password: igCredentials.password,
    });

    if (session?.success === false) {
      return session;
    }

    const { ig } = session;

    const { igClient } = await intagramService(ig!);

    this.instagramServices.push({
      id: igCredentials._id?.toString()!,
      ig: igClient,
    });

    return { success: true };
  },
}