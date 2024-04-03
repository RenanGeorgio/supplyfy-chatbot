import emailService from "./emailService";
import { IEmailCredentials } from "../../types";

interface IEmailService {
  id: string;
  mailListener: any;
  mailTransporter: any;
}

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

  async stop(id: string) {
    const service = this.emailService.find((service) => service.id === id);
    if (!service) return;
    await service.mailListener.stop();
  },

  async resume(id: string) {
    const service = this.emailService.find((service) => service.id === id);
    if (!service) return;
    try {
      await service.mailListener.start();
      // todo: verificar o pq de não estar resumindo o listener
    } catch (error) {
      console.log(error)
    }

  },
};
