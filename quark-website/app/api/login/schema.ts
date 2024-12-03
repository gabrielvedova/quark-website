import { z } from "zod";

export const PostSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Insira um nome de usuário." })
    .max(128, {
      message: "O nome de usuário deve ter no máximo 128 caracteres.",
    })
    .trim(),

  password: z
    .string()
    .min(1, { message: "Insira uma senha." })
    .max(128, { message: "A senha deve ter no máximo 128 caracteres." }),
});
