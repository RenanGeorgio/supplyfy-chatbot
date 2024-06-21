import emailService from "./emailService";
import { IEmailServiceController } from "../../types/types";
import { Events } from "../../types/enums";
import { findBot, removeBot } from "../../helpers/findBot";

export const emailServiceController: IEmailServiceController = {
  emailServices: [],

  async start(emailCredentials, webhook) {
    const id = emailCredentials._id?.toString()!;
    const bot = findBot(id, this.emailServices);

    if (bot) {
      return {
        success: false,
        event: Events.SERVICE_ALREADY_RUNNING,
        message: "serviço já está rodando",
        service: "email",
      };
    }
    
    const { mailListener, mailTransporter, mailListenerEventEmitter } =
    await emailService(emailCredentials, webhook);

    const waitForConnect = () => {
      return new Promise((resolve) => {
        let mailListenerConnected = false;
        let mailTransporterConnected = false;

        const verifyConnection = () => {
          if (mailListenerConnected && mailTransporterConnected) {
            resolve({
              success: true,
              event: Events.SERVICE_STARTED,
              message: "serviço iniciado",
              service: "email",
            });

            this.emailServices.push({
              id,
              mailListener,
              mailTransporter,
            });

            console.log(
              `📘 Email: serviço iniciado \x1b[4m${emailCredentials.emailUsername}\x1b[0m`
            );
          }
        };

        mailListenerEventEmitter.on("mailTransporter:connected", () => {
          mailTransporterConnected = true;
          verifyConnection();
        });

        mailListenerEventEmitter.on("mailListener:connected", () => {
          mailListenerConnected = true;
          verifyConnection();
        });
      });
    };

    mailListener.start();
    const connect = await waitForConnect();
    return connect;
  },

  stop(credentials) {
    const id = credentials._id?.toString()!;
    const service = findBot(id.toString(), this.emailServices);
    if (service) {
      service.mailListener.stop();
      service.mailListener.removeAllListeners();
      service.mailTransporter.close();
      service.mailTransporter.removeAllListeners();
      removeBot(service, this.emailServices);
      console.log(`📙 Email: serviço parado ${credentials.emailUsername}`);
      return {
        success: true,
        event: Events.SERVICE_STOPPED,
        service: "email",
        message: "serviço parado",
      };
    }
    return {
      success: false,
      event: Events.SERVICE_NOT_RUNNING,
      message: "serviço não está rodando",
      service: "email",
    };
  },

  resume(id) {},
};
