import { z } from "zod";

export const PutSchema = z.object({
  email: z.string().email({ message: "Insira um email válido" }),

  newEmail: z.string().email({ message: "Insira um email válido" }),

  newEmailConfirmation: z.string().email({ message: "Insira um email válido" }),
});
