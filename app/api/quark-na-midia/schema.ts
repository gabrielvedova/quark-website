import { z } from "zod";

export const GetParamsSchema = z.object({
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

export const PostSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Insira um título." })
    .max(255, { message: "Título deve ter no máximo 255 caracteres." })
    .trim(),

  description: z
    .string()
    .min(1, { message: "Insira uma descrição." })
    .max(255, { message: "Descrição deve ter no máximo 255 caracteres." })
    .trim(),

  miniature: z.string().url({ message: "Insira uma URL válida." }).min(1),

  publishingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Insira uma data válida." })
    .trim(),

  url: z.string().url({ message: "Insira uma URL válida." }).min(1),
});

export const PutSchema = z.object({
  id: z.number().int(),

  title: z
    .string()
    .min(1, { message: "Insira um título." })
    .max(255, { message: "Título deve ter no máximo 255 caracteres." })
    .trim(),

  description: z
    .string()
    .min(1, { message: "Insira uma descrição." })
    .max(255, { message: "Descrição deve ter no máximo 255 caracteres." })
    .trim()
    .optional(),

  miniature: z.string().url({ message: "Insira uma URL válida." }).optional(),

  publishingDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Insira uma data válida." })
    .trim()
    .optional(),

  url: z.string().url({ message: "Insira uma URL válida." }).optional(),
});

export const DeleteSchema = z.object({
  id: z.number().int(),
});
