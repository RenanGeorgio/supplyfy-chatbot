import { emailServiceController } from ".";
import { findBot } from "../../helpers/findBot";
import { Events } from "../../types/enums";
import { webhookTrigger } from "../../webhooks/custom/webhookTrigger";

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

    if (data?.webhookUrl) {
      webhookTrigger({
        url: data.webhookUrl,
        event: Events.MESSAGE_SENT,
        message: {
          recipientId: to,
          subject,
          text,
        },
        service: "email",
      });
    }

    return send;
  },
  options: {
    attempts: 3,
    backoff: 1000,
    removeOnComplete: true,
  },
};
