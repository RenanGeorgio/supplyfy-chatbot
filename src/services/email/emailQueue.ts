import { emailServiceController } from ".";
import { findBot } from "../../helpers/findBot";

export default {
  key: "EmailService",
  async handle({ data }) {
    const { from, to, subject, text, inReplyTo, references, service } = data;

    const emailService = findBot(
      service.id,
      emailServiceController.emailServices
    );
    if (!emailService) {
      return false;
    }

    const send = await emailService?.mailTransporter.sendMail({
      from,
      to,
      subject: "Re: " + subject,
      text,
      inReplyTo,
      references,
    });

    console.info("E-mail enviado para: ", to);
    return send;
  },
  options: {
    attempts: 3,
    backoff: 1000,
    removeOnComplete: true,
  },
};
