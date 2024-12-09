import { z } from "zod";

export const GetSchema = z.object({
  key: z.string(),
  public: z.boolean().default(true),
});
