import { findTelegramBot } from "../../helpers/findTelegramBot";
import { TelegramServiceController } from "../../types/types";
import emailService from "./emailService";

interface IEmailService {
  id: string;
  mailListener: any;
  mailTransporter: any;
}

export const emailServiceController = {
  emailService: [] as IEmailService[],

  async start({ imapHost, imapPort, smtpHost, smtpPort, emailUsername, emailPassword, secure}) {
    const email = await emailService({
      imapHost,
      imapPort,
      smtpHost,
      smtpPort,
      emailUsername,
      emailPassword,
      secure,
    });

    if (!email) {
      return null;
    }
    email.mailListener.start();

    this.emailService.push({
      id: emailUsername, // alterar dps
      mailListener: email.mailListener,
      mailTransporter: email.mailTransporter,
    })
    
    return email;
  },
};
