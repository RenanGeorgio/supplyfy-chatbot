import emailService from "./emailService";
import { IEmailCredentials } from "../../types";
import { IEmailService } from "../../types/types";

export const emailServiceController = {
  emailService: [] as IEmailService[],

  async start(emailCredentials: IEmailCredentials) {
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
      this.emailService.push({
        id: emailCredentials.emailUsername as string,
        mailListener: mailListener,
        mailTransporter: mailTransporter,
      });
    });

    mailListener.start();
    return {};
  },

  stop(id: string) {
    const service = this.emailService.find((service) => service.id === id);
    if (!service) return;
    service.mailListener.stop();
  },

  resume(id: string) {
    const service = this.emailService.find((service) => service.id === id);
    if (!service) return;
    try {
      service.mailListener.start();
      // todo: verificar o pq de não estar resumindo o listener
    } catch (error) {
      console.log(error)
    }

  },
};
