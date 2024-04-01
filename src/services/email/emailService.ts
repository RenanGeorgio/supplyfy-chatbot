
import { processQuestion } from "../../libs/trainModel";
import { IEmailService } from "../../types/types";
import emailListener from "./lib/listener";
import emailTransporter from "./lib/transporter";

const emailService = async ({
  imapHost,
  imapPort,
  smtpHost,
  smtpPort,
  emailUsername,
  emailPassword,
  secure
}: IEmailService) => {

  const mailListener = await emailListener({ emailUsername, emailPassword, imapHost, imapPort, secure });
  const mailTransporter = emailTransporter({ smtpHost, smtpPort, emailUsername, emailPassword, secure });

  mailListener.on("server:connected", function () {
    console.log("imapConnected");
  });

  mailListener.on("server:disconnected", function () {
    console.log("imapDisconnected");
  });

  mailListener.on("error", function (err: any) {
    console.log(err);
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

  return { mailListener, mailTransporter }
};

export default emailService;