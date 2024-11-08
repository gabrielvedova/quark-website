import { z } from "zod";

const GetParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, { message: "Parameter 'id' must be numeric." })
    .optional(),
});

export function convertGetParams(params: { id?: string }) {
  const convertedParams: { id?: number } = {};

  if (params.id) convertedParams.id = parseInt(params.id);

  return convertedParams;
}
