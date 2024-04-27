import nodemailer, { Transporter } from "nodemailer";
import { IEmailCredentials } from "../../../types";

const transporter = ({ smtpHost, smtpPort, emailUsername, emailPassword, smtpSecure }: Omit<IEmailCredentials, '_id'>) => {
  const transporter: Transporter =  nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    // pool: true,
    auth: {
      user: emailUsername,
      pass: emailPassword,
    },
  });

  return transporter;
};

export default transporter;