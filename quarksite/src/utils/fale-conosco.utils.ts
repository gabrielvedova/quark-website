import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Joi from "joi";

// TODO - Implement front-end validation
export const postSchema = Joi.object({
  name: Joi.string()
    .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
    .min(3)
    .max(100)
    .required()
    .messages({
      "string.empty": "The field 'name' must not be empty",
      "string.pattern.base":
        "The field 'name' must contain only letters and spaces",
      "string.min": "The field 'name' must have at least 3 characters",
      "string.max": "The field 'name' must have at most 100 characters",
      "any.required": "The field 'name' is required",
    }),
  email: Joi.string().email().required().messages({
    "string.empty": "The field 'email' must not be empty",
    "string.email": "The field 'email' must be a valid email",
    "any.required": "TThe field 'email' is required",
  }),
  phoneNumber: Joi.string()
    .pattern(/^\(\d{2}\)\s9?\d{4}-\d{4}$/)
    .required()
    .messages({
      "string.empty": "The field 'phoneNumber' must not be empty",
      "string.pattern.base":
        "Phone number must be in the format (XX) XXXX-XXXX or (XX) 9XXXX-XXXX.",
      "any.required": "The field 'phoneNumber' is required",
    }),
  institution: Joi.string().min(3).max(200).required().messages({
    "string.empty": "The field 'institution' must not be empty",
    "string.min": "The field 'institution' must have at least 3 characters",
    "string.max": "The field 'institution' must have at most 200 characters",
    "any.required": "The field 'institution' is required",
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
