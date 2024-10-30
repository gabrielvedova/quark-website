import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { z } from "zod";

// TODO - Implement front-end validation
export const PostSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The field 'name' must have at least 3 characters" })
    .max(100, { message: "The field 'name' must have at most 100 characters" })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
      message: "The field 'name' must contain only letters and spaces",
    }),

  email: z
    .string()
    .email({ message: "The field 'email' must be a valid email" }),

  phoneNumber: z.string().regex(/^\(\d{2}\)\s9?\d{4}-\d{4}$/, {
    message:
      "Phone number must be in the format (XX) XXXX-XXXX or (XX) 9XXXX-XXXX.",
  }),

  institution: z
    .string()
    .min(3, {
      message: "The field 'institution' must have at least 3 characters",
    })
    .max(200, {
      message: "The field 'institution' must have at most 200 characters",
    }),
});

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

export async function sendContactEmail(
  name: string,
  email: string,
  phoneNumber: string,
  institution: string
) {
  const sender = {
    name,
    address: email,
  };

  const recipients = [
    {
      name: process.env.RECIPIENT_MAIL_NAME || "",
      address: process.env.RECIPIENT_MAIL_ADDRESS || "",
    },
  ];

  return await sendEmail(
    sender,
    recipients,
    `Solicitação de contato de ${name}`,
    `
    <ul>
      <li><strong>Nome:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Telefone:</strong> ${phoneNumber}</li>
      <li><strong>Instituição:</strong> ${institution}</li>
    </ul>
    `
  );
}
