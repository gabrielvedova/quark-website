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

export const PostSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  miniature: z
    .string()
    .url({ message: "Miniature must be a valid url" })
    .min(1),
  published: z.boolean(),
});

export const PutSchema = z.object({
  id: z.number(),
  title: z.string().max(255).optional(),
  content: z.string().optional(),
  miniature: z
    .string()
    .url({ message: "Miniature must be a valid url" })
    .optional(),
  published: z.boolean().optional(),
});

export const DeleteSchema = z.object({
  id: z.number(),
});
