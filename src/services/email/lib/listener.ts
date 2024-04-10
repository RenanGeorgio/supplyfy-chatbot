import { MailListener } from "mail-listener5";
import { IMailListener, IOptions } from "./types";
import { IEmailCredentials } from "../../../types";

const emailListener = ({ emailUsername, emailPassword, imapHost, imapPort, imapTls}: IEmailCredentials): IMailListener  => {
  const mailListener = new MailListener({
    username: emailUsername,
    password: emailPassword,
    host: imapHost,
    port: imapPort,
    tls: true,
    connTimeout: 10000,
    authTimeout: 5000,
    autotls: "never",
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX",
    searchFilter: ["RECENT", "UNSEEN"],
    markSeen: true,
    fetchUnreadOnStart: true,
    debugger: console.log,
    // mailParserOptions: { streamAttachments: true },
    attachments: false,
    // attachmentOptions: { directory: "attachments/" },
  } as IOptions);
  return mailListener;
};

export default emailListener;