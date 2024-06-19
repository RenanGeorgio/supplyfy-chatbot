import Queue from "../../libs/Queue";
import { produceMessage } from "../../core/kafka/producer";
import { processQuestion } from "../../libs/trainModel";
import { botExist } from "../../repositories/bot";
import { IEmailCredentials, IWebhook } from "../../types";
import { Events } from "../../types/enums";
import { webhookTrigger } from "../../webhooks/custom/webhookTrigger";
import emailListener from "./lib/listener";
import emailTransporter from "./lib/transporter";
import EventEmitter from "node:events";

const errorMessages = {
  authentication: "erro de autenticação imap",
  "timeout-auth": "timeout de autenticação",
};

const emailService = async (
  credentials: IEmailCredentials,
  webhook: IWebhook | undefined
) => {
  const {
    imapHost,
    imapPort,
    imapTls,
    smtpHost,
    smtpPort,
    smtpSecure,
    emailUsername,
    emailPassword,
    service
  } = credentials;
  const mailListenerEventEmitter = new EventEmitter();

  const mailTransporter = emailTransporter({
    smtpHost,
    smtpPort,
    emailUsername,
    emailPassword,
    smtpSecure,
    service
  });

  mailTransporter.verify((error, success) => {
    if (error) {
      console.log(webhook)
      if(webhook){

        webhookTrigger({
          url: webhook.url,
          event: Events.SERVICE_ERROR,
          message: "erro de autenticação smtp",
          service: "email",
        });
      }
      console.log("Server is not ready to take our messages: ", error);
    } else {
      console.log(`SMPT conectado: ${smtpHost}`);
    }
  });

  const mailListener = emailListener({
    emailUsername,
    emailPassword,
    imapHost,
    imapPort,
    imapTls,
  });

  const botInfo = await botExist("services.email.emailUsername", emailUsername);

  const kafkaMessage = {
    topic: botInfo?.companyId + ".messages",
    service: "email"
  }

  mailListener.on("server:connected", function () {
    mailListenerEventEmitter.emit("email:connected");
    console.log(`IMAP conectado: ${imapHost}`);
  });

  mailListener.on("server:disconnected", function (e) {
    console.log(e)
    console.log("imapDisconnected");
    if (webhook) {
      webhookTrigger({
        url: webhook.url,
        event: Events.SERVICE_DISCONNECTED,
        message: "imap desconectado",
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
        if(err.code === "ECONNRESET"){
          mailListener.start();
        }
      } else {
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
    const emailText = mail.text?.split(/\r?\n/).join(" "); // adicionar algum tratamento para a mensagem
    (async () => {
      // console.log("mail.text", mail.text)
      // console.log("emailText", emailText)
      // console.log("mail obj", mail)
      await produceMessage({ text: emailText, from: mail.from.value[0].address, to: emailUsername, ...kafkaMessage })
      const responseMessage = await processQuestion(emailText);
      if (!responseMessage) return;

      Queue.add("EmailService", {
        from: emailUsername,
        to: mail.from.value[0].address,
        subject: mail.subject || attributes.uid,
        text: responseMessage,
        inReplyTo: mail.messageId,
        references: mail.messageId,
        service: {
          type: "email",
          id: credentials._id?.toString(),
        },
      });
      await produceMessage({ text: responseMessage, from: emailUsername, to: mail.from.value[0].address, ...kafkaMessage })
    })();
  });

  return { mailListener, mailTransporter, mailListenerEventEmitter };
};

export default emailService;
