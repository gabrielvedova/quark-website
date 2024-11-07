import { z } from "zod";

export const PostSchema = z.object({
  email: z.string().email({ message: "Insira um email válido" }).trim(),
});
