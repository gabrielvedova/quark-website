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

async function sendEmail(
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

/**
 * Send an email to the website owner with the contact information.
 *
 * @param data.name The name of the person who is contacting.
 * @param data.email The email of the person who is contacting.
 * @param data.phoneNumber The phone number of the person who is contacting.
 * @param data.institution The institution of the person who is contacting.
 *
 * @returns A promise that resolves when the email is sent.
 */
export async function sendContactEmail(data: {
  name: string;
  email: string;
  phoneNumber: string;
  institution: string;
}) {
  const { name, email, phoneNumber, institution } = data;

  const sender = {
    name,
    address: email,
  };

  const recipients = [
    {
      name: process.env.EMAIL_NAME || "",
      address: process.env.EMAIL_ADDRESS || "",
    },
  ];

  const emailSubject = `Solicitação de contato de ${name}`;

  const emailContent = `
  <ul>
    <li><strong>Nome:</strong> ${name}</li>
    <li><strong>Email:</strong> ${email}</li>
    <li><strong>Telefone:</strong> ${phoneNumber}</li>
    <li><strong>Instituição:</strong> ${institution}</li>
  </ul>
  `;

  return await sendEmail(sender, recipients, emailSubject, emailContent);
}
