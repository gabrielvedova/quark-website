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

export async function sendRecoveryEmail(data: { email: string; code: string }) {
  const { email, code } = data;

  const sender = {
    name: process.env.EMAIL_NAME || "",
    address: process.env.EMAIL_ADDRESS || "",
  };

  const recipients = [
    {
      name: email,
      address: email,
    },
  ];

  const emailSubject =
    "Recuperação de senha do sistema de administração do website da Quark";

  const emailContent = `
  Você solicitou a recuperação de senha para a sua conta no nosso sistema, não compartilhe-o com ninguém. <br />
  Todos os códigos de recuperação enviados anteriormente foram invalidados. <br />
  Se você não fez essa solicitação, por favor, ignore este email. <br />
  <br />
  Caso contrário, utilize este código para redefinir sua senha: ${code} <br />
  Este código expira em 30 minutos. <br />
  <br />
  Este é um email automático, por favor, não responda.
  `;

  return await sendEmail(sender, recipients, emailSubject, emailContent);
}
