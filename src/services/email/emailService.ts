import { processQuestion } from "../../libs/trainModel";
import { IEmailCredentials } from "../../types";
import emailListener from "./lib/listener";
import emailTransporter from "./lib/transporter";
import EventEmitter from "node:events";

const emailService = async ({
  imapHost,
  imapPort,
  smtpHost,
  smtpPort,
  emailUsername,
  emailPassword,
  imapTls,
  smtpSecure
}: IEmailCredentials) => {
  const mailTransporter = emailTransporter({ smtpHost, smtpPort, emailUsername, emailPassword, smtpSecure });
  const mailListener = emailListener({ emailUsername, emailPassword, imapHost, imapPort, imapTls });
  const mailListenerEventEmitter = new EventEmitter();

  console.log("emailService", mailListener)
  
  mailListener.on("server:connected", function () {
    console.log("imapConnected");
    mailListenerEventEmitter.emit("email:connected")
  });

  mailListener.on("server:disconnected", function () {
    console.log("imapDisconnected");
  });

  mailListener.on("error", function (err: any) {
    console.log(err);
    mailListenerEventEmitter.emit("error", err)
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

    console.info("Email sent to", mail.from.value[0].address);
  });

  mailListener.start();

  return { mailListener, mailTransporter, mailListenerEventEmitter }
};

export default emailService;