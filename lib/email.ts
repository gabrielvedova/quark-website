import { EmailSendingError } from "./errors";
import ses from "./ses";

export async function sendContactEmail(data: {
  name: string;
  email: string;
  phoneNumber: string;
  institution: string;
}) {
  const { name, email, phoneNumber, institution } = data;

  try {
    await ses
      .sendEmail({
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
            </ul>
            `,
            },
          },
        },
        Source: email,
      })
      .promise();
  } catch (error) {
    throw new EmailSendingError();
  }
}
