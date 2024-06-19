import nodemailer, { Transporter } from "nodemailer";
import { IEmailCredentials } from "../../../types";

const transporter = ({ smtpHost, smtpPort, emailUsername, emailPassword, smtpSecure, service }: Omit<IEmailCredentials, '_id'>) => {
  const transporter: Transporter =  nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    // pool: true,
    auth: {
      user: emailUsername,
      pass: emailPassword,
    },
    // tls: {
    //   rejectUnauthorized: false,
    //   ciphers:'SSLv3' // avaliar dps
    // },
    service
  });

  return transporter;
};

export default transporter;