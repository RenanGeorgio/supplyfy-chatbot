const { MailListener } = require("mail-listener5");
import { processQuestion } from "../../helpers/trainModel";
import transporter from "./transporter";

const mailListener = new MailListener({
  username: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.IMAP_SERVER,
  port: process.env.IMAP_PORT,
  tls: true,
  connTimeout: 10000,
  authTimeout: 5000,
  tlsOptions: { rejectUnauthorized: false },
  mailbox: "INBOX",
  searchFilter: ["RECENT", "UNSEEN"],
  markSeen: true,
  fetchUnreadOnStart: true,
  debugger: console.log,
  // mailParserOptions: { streamAttachments: true },
  // attachments: true,
  // attachmentOptions: { directory: "attachments/" },
});

const emailListener = () => {
  mailListener.start();
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
      
      await transporter.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: mail.from.value[0].address,
        subject: "Re: " + (mail.subject || attributes.uid),
        text: responseMessage,
        inReplyTo: mail.messageId,
        references: mail.messageId,
      });
    })();

    console.info("Email sent to", mail.from.value[0].address);
  });
};

export default emailListener;
