import { IgApiClientRealtime } from "instagram_mqtt";
import instagramLogin from "./auth/session";
import intagramService from "./instagram";

export const instagramServiceController = {
  instagramService: [] as IgApiClientRealtime[],

  async start(igCredentials: Record<string, any>) {
    const { ig } = await instagramLogin({
      username: igCredentials.username,
      password: igCredentials.password,
    });

    const { igClient } = await intagramService(ig);

    this.instagramService.push(igClient);
  },
}