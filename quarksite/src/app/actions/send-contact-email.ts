import { sendEmail } from "@/lib/email";

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
