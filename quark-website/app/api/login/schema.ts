import { z } from "zod";

export const PostSchema = z.object({
  email: z.string().email({ message: "Insira um email válido" }).trim(),

  password: z
    .string()
    .max(128, { message: "A senha deve ter no máximo 128 caracteres." }),
});
