import { z } from "zod";

export const GetParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, { message: "Parameter 'id' must be numeric." })
    .optional(),
  search: z.string().optional(),
  published: z
    .string()
    .regex(/^(true|false)$/, {
      message: "Parameter 'published' must be a boolean value.",
    })
    .optional(),
});

export function convertGetParams(params: {
  id?: string;
  search?: string;
  published?: string;
}) {
  const convertedParams: { id?: number; search?: string; published?: boolean } =
    {};

  if (params.id) {
    convertedParams.id = parseInt(params.id);
  }

  if (params.search) {
    convertedParams.search = params.search;
  }

  if (params.published) {
    convertedParams.published = params.published === "true";
  }

  return convertedParams;
}
