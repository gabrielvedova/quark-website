import { fileTypeFromBuffer } from "file-type";
import { z } from "zod";

export const PostSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve possuir pelo menos 3 caracteres." })
    .max(50, { message: "O nome deve possuir até 50 caracteres." })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
      message: "O nome deve possuir apenas letras e espaços.",
    })
    .trim(),

  role: z
    .string()
    .max(50, { message: "O cargo deve possuir até 50 caracteres." })
    .trim(),

  username: z
    .string()
    .min(4, {
      message: "O nome de usuário deve possuir pelo menos 4 caracteres.",
    })
    .max(32, { message: "O nome de usuário deve possuir até 32 caracteres." })
    .regex(/^[A-Za-z\d_.]+$/, {
      message:
        "O nome de usuário deve possuir apenas letras, dígitos, underscores e pontos.",
    })
    .trim(),

  password: z
    .string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
    .max(128, { message: "A senha deve ter no máximo 128 caracteres." })
    .regex(/(?=.*[a-z])/, {
      message: "A senha deve ter pelo menos uma letra minúscula.",
    })
    .regex(/(?=.*[A-Z])/, {
      message: "A senha deve ter pelo menos uma letra maiúscula.",
    })
    .regex(/(?=.*\d)/, { message: "A senha deve ter pelo menos um dígito." })
    .regex(/(?=.*[!@#$%&*-=])/, {
      message: "A senha deve ter pelo menos um caractere especial.",
    })
    .regex(/^[A-Za-z\d!@#$%&*-=]+$/, {
      message:
        "A senha deve conter apenas letras, dígitos e caracteres especiais permitidos.",
    }),

  passwordConfirmation: z.string(),

  profilePictureFile: z
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
});
