import { ConventionalResponse } from "@/lib/responses";
import { DeleteSchema, GetParamsSchema, PostSchema, PutSchema } from "./schema";
import { adminAuthApiMiddleware } from "@/lib/auth";
import { deleteImage, getImage, moveImage, uploadImage } from "@/lib/images";
import {
  FileDeletionError,
  FileKeyAlreadyInUseError,
  FileMovingError,
  FileNotFoundError,
  FileUploadError,
} from "@/lib/errors";

export const OPTIONS = async () => {
  return ConventionalResponse.ok({
    data: { methods: ["GET", "POST", "PUT", "DELETE"] },
  });
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const paramsObject = Object.fromEntries(searchParams);
  const validatedParams = GetParamsSchema.safeParse(paramsObject);

  if (!validatedParams.success) {
    return ConventionalResponse.badRequest({
      error: validatedParams.error.flatten().fieldErrors,
    });
  }

  try {
    const url = await getImage(validatedParams.data.key);
    return ConventionalResponse.ok({ data: { url } });
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Imagem não encontrada",
      });
    }

    return ConventionalResponse.internalServerError();
  }
};

export const POST = adminAuthApiMiddleware(async (request: Request) => {
  const body = await request.json();
  const validatedBody = await PostSchema.safeParseAsync(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await uploadImage(validatedBody.data);
    return ConventionalResponse.created({
      message: "Imagem enviada com sucesso.",
    });
  } catch (error) {
    if (error instanceof FileKeyAlreadyInUseError) {
      return ConventionalResponse.conflict({
        error: {
          key: ["Chave já utilizada."],
        },
      });
    }

    if (error instanceof FileUploadError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro no upload da imagem.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
});

export const PUT = adminAuthApiMiddleware(async (request: Request) => {
  const body = await request.json();
  const validatedBody = PutSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await moveImage(validatedBody.data);
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Imagem não encontrada.",
      });
    }

    if (error instanceof FileKeyAlreadyInUseError) {
      return ConventionalResponse.conflict({
        error: {
          newKey: ["Chave já utilizada."],
        },
      });
    }

    if (error instanceof FileMovingError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao mover a imagem.",
      });
    }

    if (error instanceof FileDeletionError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao deletar a imagem.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
});

export const DELETE = adminAuthApiMiddleware(async (request: Request) => {
  const body = await request.json();
  const validatedBody = DeleteSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await deleteImage(validatedBody.data.key);
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Imagem não encontrada.",
      });
    }

    if (error instanceof FileDeletionError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao deletar a imagem.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
});
