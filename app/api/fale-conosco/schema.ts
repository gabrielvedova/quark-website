import { z } from "zod";

export const PostSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres." })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres." })
    .regex(/^[A-Za-zÀ-ÿ\u0100-\u017F\s]+$/, {
      message: "Nome deve possuir apenas letras e espaços.",
    })
    .trim(),

  email: z.string().email({ message: "Insira um e-mail válido." }).trim(),

  phoneNumber: z
    .string()
    .regex(/^\(\d{2}\)\s9?\d{4}-\d{4}$/, {
      message:
        "O número de telefone deve seguir o padrão (XX) XXXX-XXXX or (XX) 9XXXX-XXXX.",
    })
    .trim(),

  institution: z
    .string()
    .min(3, {
      message: "Instituição deve ter pelo menos 3 caracteres.",
    })
    .max(200, {
      message: "Insituição deve ter no máximo 200 caracteres.",
    })
    .trim(),
});
