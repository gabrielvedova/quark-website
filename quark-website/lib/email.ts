import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT),
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

async function sendEmail(
  sender: Mail.Address,
  recipient: Mail.Address,
  subject: string,
  content: string
) {
  return await transporter.sendMail({
    from: sender,
    to: recipient,
    subject,
    html: content,
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

  const sender = { name, address: email };
  const recipient = {
    name: process.env.CONTACT_RECIPIENT_NAME || "",
    address: process.env.CONTACT_RECIPIENT_ADDRESS || "",
  };
  const subject = `Solicitação de contato de ${name}`;
  const content = `
  <ul>
    <li><strong>Nome:</strong> ${name}</li>
    <li><strong>Email:</strong> ${email}</li>
    <li><strong>Telefone:</strong> ${phoneNumber}</li>
    <li><strong>Instituição:</strong> ${institution}</li>
  </ul>
  `;

  return await sendEmail(sender, recipient, subject, content);
}
