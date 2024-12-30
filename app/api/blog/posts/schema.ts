import { fileTypeFromBuffer } from "file-type";
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
  const convertedParams: {
    id?: number;
    search?: string;
    published?: boolean;
  } = {};

  if (params.id) convertedParams.id = parseInt(params.id);
  if (params.search) convertedParams.search = params.search;
  if (params.published) convertedParams.published = params.published === "true";

  return convertedParams;
}

export const PostSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Insira um título." })
    .max(255, { message: "Título deve ter no máximo 255 caracteres." })
    .trim(),

  content: z
    .string()
    .min(1, { message: "Insira um conteúdo." })
    .startsWith("<", { message: "O conteúdo deve ser um HTML válido." })
    .endsWith(">", { message: "O conteúdo deve ser um HTML válido." }),

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
      { message: "O arquivo deve ter até 10MB." }
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

  published: z.boolean().default(false),
});

export const PutSchema = z.object({
  id: z.number().int(),

  title: z
    .string()
    .max(255, { message: "Título deve ter no máximo 255 caracteres." })
    .trim()
    .optional(),

  content: z.string().optional(),

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

  published: z.boolean().optional(),
});

export const DeleteSchema = z.object({
  id: z.number().int(),
});
