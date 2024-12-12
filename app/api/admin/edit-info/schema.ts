import { fileTypeFromBuffer } from "file-type";
import { z } from "zod";

export const PutSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve possuir pelo menos 3 caracteres." })
    .max(100, { message: "O nome deve possuir até 100 caracteres." })
    .regex(/^[A-Za-zÀ-ÿ\u0100-\u017F\s]+$/, {
      message: "O nome deve possuir apenas letras e espaços.",
    })
    .trim()
    .optional(),

  role: z
    .string()
    .max(50, { message: "O cargo deve possuir até 50 caracteres." })
    .trim()
    .optional(),

  profilePictureFile: z
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
    .optional(),
});
