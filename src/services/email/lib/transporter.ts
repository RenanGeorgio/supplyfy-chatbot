import nodemailer from "nodemailer";
import { IEmailCredentials } from "../../../types/types";

const transporter = ({ smtpHost, smtpPort, emailUsername, emailPassword, smtpSecure }: IEmailCredentials) => {
  const transporter =  nodemailer.createTransport({
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