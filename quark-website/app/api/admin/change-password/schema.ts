import { z } from "zod";

export const PatchSchema = z.object({
  password: z.string(),

  newPassword: z
    .string()
    .min(8, { message: "A senha deve ter no mínimo 8 caracteres" })
    .max(128, { message: "A senha deve ter no máximo 128 caracteres" })
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

  newPasswordConfirmation: z.string(),
});
