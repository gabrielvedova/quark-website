import { z } from "zod";

export const PostSchema = z.object({
  name: z
    .string()
    .min(3, { message: "The field 'name' must have at least 3 characters" })
    .max(100, { message: "The field 'name' must have at most 100 characters" })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
      message: "The field 'name' must contain only letters and spaces",
    }),

  email: z
    .string()
    .email({ message: "The field 'email' must be a valid email" }),

  phoneNumber: z.string().regex(/^\(\d{2}\)\s9?\d{4}-\d{4}$/, {
    message:
      "Phone number must be in the format (XX) XXXX-XXXX or (XX) 9XXXX-XXXX.",
  }),

  institution: z
    .string()
    .min(3, {
      message: "The field 'institution' must have at least 3 characters",
    })
    .max(200, {
      message: "The field 'institution' must have at most 200 characters",
    }),
});
