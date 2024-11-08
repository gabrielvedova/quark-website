import { z } from "zod";

export const PatchSchema = z.object({
  email: z.string().email({ message: "Insira um email válido" }).trim(),

  newEmail: z.string().email({ message: "Insira um email válido" }).trim(),

  newEmailConfirmation: z
    .string()
    .email({ message: "Insira um email válido" })
    .trim(),
});
