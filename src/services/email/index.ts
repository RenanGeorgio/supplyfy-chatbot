import emailService from "./emailService";
import { Events, IEmailServiceController } from "../../types/types";
import { findBot } from "../../helpers/findBot";

export const emailServiceController: IEmailServiceController = {
  emailServices: [],

  async start(emailCredentials) {
    const { mailListener, mailTransporter, mailListenerEventEmitter } = await emailService(emailCredentials);

    const waitForConnect = () => {
      return new Promise((resolve) => {
        mailListenerEventEmitter.on("error", (err: any) => {
          if (err.source === "authentication") {
            console.error("Erro de autenticação");
            resolve({
              success: false,
              event: Events.SERVICE_ERROR,
              message: "erro de autenticação",
              service: "email"
            });
            // enviar evento pelo kafka ?
          } else {
            console.error(err);
            resolve({
              success: false,
              event: Events.SERVICE_ERROR,
              message: "erro inesperado",
              service: "email"
            });
          }
        });

        mailListenerEventEmitter.on("email:connected", () => {
          this.emailServices.push({
            id: emailCredentials._id?.toString()!,
            mailListener: mailListener,
            mailTransporter: mailTransporter,
          });

          resolve({
            success: true,
            event: Events.SERVICE_STARTED,
            message: "serviço iniciado",
            service: "email"
          });
        });
      });
    };

    const connect = await waitForConnect();

    return connect;
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
      console.log(error);
    }
  },
};