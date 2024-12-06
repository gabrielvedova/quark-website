import { z } from "zod";

export const PatchSchema = z.object({
  password: z.string().min(1, { message: "Insira a senha atual." }),

  newUsername: z
    .string()
    .min(4, {
      message: "O nome de usuário deve possuir pelo menos 4 caracteres.",
    })
    .max(32, { message: "O nome de usuário deve possuir até 32 caracteres." })
    .regex(/^[A-Za-z\d_.]+$/, {
      message:
        "O nome de usuário deve possuir apenas letras, dígitos, underscores e pontos.",
    })
    .trim(),

  newUsernameConfirmation: z.string(),
});
