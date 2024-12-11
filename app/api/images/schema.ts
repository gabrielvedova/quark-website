import { fileTypeFromBuffer } from "file-type";
import { z } from "zod";

export const GetSchema = z.object({
  key: z.string(),
});

export const PostSchema = z.object({
  key: z.string().min(1, { message: "Nome é obrigatório" }),
  file: z
    .string()
    .min(1, { message: "O arquivo é obrigatório." })
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
    .transform(async (data) => {
      return {
        data: Buffer.from(data, "base64"),
        type:
          (await fileTypeFromBuffer(Buffer.from(data, "base64")))?.mime ||
          "unknown",
      };
    }),
});

export const PutSchema = z.object({
  currentKey: z.string().min(1, { message: "A chave atual é obrigatória" }),
  newKey: z.string().min(1, { message: "A nova chave é obrigatória" }),
});

export const DeleteSchema = z.object({
  key: z.string().min(1, { message: "A chave é obrigatória" }),
});
