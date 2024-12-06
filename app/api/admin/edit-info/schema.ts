import { z } from "zod";

export const PutSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve possuir pelo menos 3 caracteres." })
    .max(100, { message: "O nome deve possuir até 100 caracteres." })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
      message: "O nome deve possuir apenas letras e espaços.",
    })
    .trim()
    .optional(),

  role: z
    .string()
    .max(50, { message: "O cargo deve possuir até 50 caracteres." })
    .trim()
    .optional(),

  profilePicture: z
    .string()
    .url({ message: "Insira uma URL válida." })
    .optional(),
});
