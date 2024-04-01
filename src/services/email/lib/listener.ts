import exp from "constants";
import { IEmailService } from "../../../types/types";
const { MailListener } = require("mail-listener5");

const emailListener = async ({ emailUsername, emailPassword, imapHost, imapPort}: IEmailService) => {
  const mailListener = new MailListener({
    username: emailUsername,
    password: emailPassword,
    host: imapHost,
    port: imapPort,
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
  return mailListener;
};

export default emailListener;