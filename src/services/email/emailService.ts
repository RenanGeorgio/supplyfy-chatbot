import { processQuestion } from "../../libs/trainModel";
import { IEmailCredentials, IWebhook } from "../../types";
import { Events } from "../../types/types";
import { webhookTrigger } from "../webhook/webhookTrigger";
import emailListener from "./lib/listener";
import emailTransporter from "./lib/transporter";
import EventEmitter from "node:events";

const errorMessages = {
  authentication: "erro de autenticação",
  "timeout-auth": "timeout de autenticação",
}

const emailService = async (credentials: IEmailCredentials, webhook: IWebhook | undefined) => {
  const { imapHost, imapPort, imapTls, smtpHost, smtpPort, smtpSecure, emailUsername, emailPassword } = credentials;
  const mailTransporter = emailTransporter({ smtpHost, smtpPort, emailUsername, emailPassword, smtpSecure });
  const mailListener = emailListener({ emailUsername, emailPassword, imapHost, imapPort, imapTls });
  const mailListenerEventEmitter = new EventEmitter();

  mailListener.on("server:connected", function () {
    console.log("imapConnected");
    mailListenerEventEmitter.emit("email:connected");
  });

  mailListener.on("server:disconnected", function () {
    console.log("imapDisconnected");
    if (webhook) {
      webhookTrigger({
        url: webhook.url,
        event: Events.SERVICE_DISCONNECTED,
        message: "serviço de email desconectado",
        service: "email",
      });
    }
  });

  mailListener.on("error", function (err: any) {
    if (webhook) {
      if (errorMessages.hasOwnProperty(err.source)) {
        webhookTrigger({
          url: webhook.url,
          event: Events.SERVICE_ERROR,
          message: errorMessages[err.source],
          service: "email",
        });
      }
      else {
        console.error(err);
        webhookTrigger({
          url: webhook.url,
          event: Events.SERVICE_ERROR,
          message: "erro inesperado",
          service: "email",
        });
      }
    }
  });

  mailListener.on("mail", (mail: any, seqno: any, attributes: any) => {
    const emailText = mail.text.split(/\r?\n/).join(" "); // adicionar algum tratamento para a mensagem

    (async () => {
      const responseMessage = await processQuestion(emailText);
      if (!responseMessage) return;

      await mailTransporter.sendMail({
        from: emailUsername,
        to: mail.from.value[0].address,
        subject: "Re: " + (mail.subject || attributes.uid),
        text: responseMessage,
        inReplyTo: mail.messageId,
        references: mail.messageId,
      });
    })();

    console.info("E-mail enviado para: ", mail.from.value[0].address);
  });

  return { mailListener, mailTransporter, mailListenerEventEmitter };
};

export default emailService;