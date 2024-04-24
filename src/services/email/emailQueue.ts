import { emailServiceController } from ".";
import { findBot } from "../../helpers/findBot";

export default {
  key: "EmailService",
  async handle({ data }) {
    const { to, service } = data;

    const emailService = findBot(
      service.id,
      emailServiceController.emailServices
    );
    if (!emailService) {
      return false;
    }

    const send = await emailService?.mailTransporter.sendMail(data);
    console.info("E-mail enviado para: ", to);
    return send;
  },
  options: {
    attempts: 3,
    backoff: 1000,
    removeOnComplete: true,
  },
};
