import nodemailer from "nodemailer";
import { IEmailService } from "../../../types/types";

const transporter = ({ smtpHost, smtpPort, emailUsername, emailPassword, secure }: IEmailService) => {
  const transporter =  nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: secure,
    // pool: true,
    auth: {
      user: emailUsername,
      pass: emailPassword,
    },
  });

  return transporter;
};

export default transporter;