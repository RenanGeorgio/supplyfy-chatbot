import { MailListener } from "mail-listener5";
import { IMailListener, IOptions } from "./types";
import { IEmailCredentials } from "../../../types";

const emailListener = ({ emailUsername, emailPassword, imapHost, imapPort, imapTls}: IEmailCredentials): IMailListener  => {
  const mailListener = new MailListener({
    username: emailUsername,
    password: emailPassword,
    host: imapHost,
    port: imapPort,
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
    attachments: false,
    // attachmentOptions: { directory: "attachments/" },
  } as IOptions);
  return mailListener;
};

export default emailListener;