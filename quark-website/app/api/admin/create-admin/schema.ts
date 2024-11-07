import { z } from "zod";

export const PostSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve possuir pelo menos 3 caracteres." })
    .max(50, { message: "O nome deve possuir até 50 caracteres." })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
      message: "O nome deve possuir apenas letras e espaços.",
    })
    .trim(),

  role: z
    .string()
    .max(50, { message: "O cargo deve possuir até 50 caracteres." })
    .trim(),

  email: z.string().email({ message: "Insira um email válido" }).trim(),

  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
    .max(128, { message: "A senha deve ter no máximo 128 caracteres." })
    .regex(/(?=.*[a-z])/, {
      message: "A senha deve ter pelo menos uma letra minúscula.",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "A senha deve ter pelo menos uma letra maiúscula.",
    })
    .regex(/(?=.*\d)/, { message: "A senha deve ter pelo menos um dígito." })
    .regex(/(?=.*[!@#$%&*-=])/, {
      message: "A senha deve ter pelo menos um caractere especial.",
    })
    .regex(/^[A-Za-z\d!@#$%&*-=]+$/, {
      message:
        "A senha deve conter apenas letras, dígitos e caracteres especiais permitidos.",
    }),
});
