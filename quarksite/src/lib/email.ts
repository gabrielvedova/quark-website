import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
} as SMTPTransport.Options);

export async function sendEmail(
  sender: Mail.Address,
  recipients: Mail.Address[],
  subject: string,
  message: string
) {
  return await transporter.sendMail({
    from: sender,
    to: recipients,
    subject,
    text: message,
    html: message,
  });
}
