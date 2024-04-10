import emailService from "./emailService";
import { Events, IEmailServiceController } from "../../types/types";
import { findBot, removeBot } from "../../helpers/findBot";

export const emailServiceController: IEmailServiceController = {
  emailServices: [],

  async start(emailCredentials, webhook) {
    const { 
      mailListener, 
      mailTransporter, 
      mailListenerEventEmitter 
    } = await emailService(emailCredentials, webhook);

    const waitForConnect = () => {
      return new Promise((resolve) => {
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

  stop(credentials) {
    const id = credentials._id?.toString()!;
    const service = findBot(id.toString(), this.emailServices);
    if(service){
      service.mailListener.stop();
      service.mailListener.removeAllListeners();
      service.mailTransporter.close();
      service.mailTransporter.removeAllListeners();
      removeBot(service, this.emailServices);
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
      message: "serviço não está rodando",
      service: "email",
    };
  },

  resume(id) {
  },
};