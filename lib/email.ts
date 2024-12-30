import { SendEmailCommand } from "@aws-sdk/client-ses";
import { EmailSendingError } from "./errors";
import sesClient from "./ses";

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phoneNumber: string;
  institution: string;
  reason?: string;
}) {
  const { name, email, phoneNumber, institution, reason } = data;
  const params = {
    Destination: {
      ToAddresses: [process.env.CONTACT_RECIPIENT_ADDRESS || ""],
    },
    Message: {
      Subject: {
        Data: `Solicitação de contato de ${name} da instituição ${institution}`,
      },
      Body: {
        Html: {
          Data: `
        <ul>
          <li><strong>Nome:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Telefone:</strong> ${phoneNumber}</li>
          <li><strong>Instituição:</strong> ${institution}</li>
          <li><strong>Motivo:</strong> ${reason}</li>
        </ul>
        `,
        },
      },
    },
    Source: email,
  };

  try {
    const command = new SendEmailCommand(params);
    await sesClient.send(command);
  } catch (error) {
    throw new EmailSendingError();
  }
}
