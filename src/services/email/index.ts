import emailService from "./emailService";
import { IEmailServiceController } from "../../types/types";
import { findBot } from "../../helpers/findBot";

export const emailServiceController: IEmailServiceController = {
  emailServices: [],

  async start(emailCredentials) {
    const { mailListener, mailTransporter, mailListenerEventEmitter } = await emailService(emailCredentials);

    mailListenerEventEmitter.on("error", (err: any) => {
      if (err.source === "authentication") {
        console.error("Erro de autenticação");
        // enviar evento pelo kafka ?
      } else {
        console.error(err);
      }
    });

    mailListenerEventEmitter.on("email:connected", () => {
      console.log("Email conectado");
      this.emailServices.push({
        id: emailCredentials._id?.toString()!,
        mailListener: mailListener,
        mailTransporter: mailTransporter,
      });
    });

    mailListener.start();

    return {}
  },

  stop(id) {
    const service = findBot(id, this.emailServices);
    if (!service) return;
    service.mailListener.stop();
  },

  resume(id) {
    const service = findBot(id, this.emailServices);
    if (!service) return;
    try {
      service.mailListener.start();
      // todo: verificar o pq de não estar resumindo o listener
    } catch (error) {
      console.log(error)
    }

  },
};
