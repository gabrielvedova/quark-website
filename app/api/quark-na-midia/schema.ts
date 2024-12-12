import { fileTypeFromBuffer } from "file-type";
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

  miniatureFile: z
    .string()
    .refine(
      (data) => /^([0-9a-zA-Z+/=]+)$/.test(data), // Check if the file is base64 encoded
      {
        message: "O arquivo não é válido.",
      }
    )
    .refine(
      (data) => {
        const sizeInBytes =
          (data.length * 3) / 4 -
          (data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0);

        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        return sizeInBytes <= maxSizeInBytes;
      },
      { message: "O arquivo deve até 10MB." }
    )
    .refine(
      async (data) => {
        const buffer = Buffer.from(data, "base64");
        const fileType = await fileTypeFromBuffer(buffer);
        const allowedFileTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ];

        return fileType && allowedFileTypes.includes(fileType.mime);
      },
      {
        message: "O arquivo deve ser uma imagem JPEG, PNG, WEBP ou GIF.",
      }
    ),

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

  miniatureFile: z
    .string()
    .refine(
      (data) => /^([0-9a-zA-Z+/=]+)$/.test(data), // Check if the file is base64 encoded
      {
        message: "O arquivo não é válido.",
      }
    )
    .refine(
      (data) => {
        const sizeInBytes =
          (data.length * 3) / 4 -
          (data.endsWith("==") ? 2 : data.endsWith("=") ? 1 : 0);

        const maxSizeInBytes = 10 * 1024 * 1024; // 10MB
        return sizeInBytes <= maxSizeInBytes;
      },
      { message: "O arquivo deve até 10MB." }
    )
    .refine(
      async (data) => {
        const buffer = Buffer.from(data, "base64");
        const fileType = await fileTypeFromBuffer(buffer);
        const allowedFileTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "image/gif",
        ];

        return fileType && allowedFileTypes.includes(fileType.mime);
      },
      {
        message: "O arquivo deve ser uma imagem JPEG, PNG, WEBP ou GIF.",
      }
    )
    .optional(),

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
