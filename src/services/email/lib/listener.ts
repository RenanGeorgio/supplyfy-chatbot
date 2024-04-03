import exp from "constants";
import { IEmailCredentials } from "../../../types/types";
const { MailListener } = require("mail-listener5");

const emailListener = ({ emailUsername, emailPassword, imapHost, imapPort, imapTls }: IEmailCredentials) => {
  console.log(emailUsername, emailPassword, imapHost, imapPort, imapTls)
  const mailListener = new MailListener({
    username: emailUsername, // emailUsername,
    password: emailPassword,
    host: imapHost,
    port: imapPort, // imap port
    tls: imapTls,
    connTimeout: 15000,
    authTimeout: 8000,
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