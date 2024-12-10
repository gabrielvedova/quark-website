import { ConventionalResponse } from "@/lib/responses";
import { DeleteSchema, GetSchema, PostSchema, PutSchema } from "./schema";
import { adminAuthApiMiddleware } from "@/lib/auth";
import { deleteImage, getImage, moveImage, uploadImage } from "@/lib/images";
import {
  FileDeleteError,
  FileKeyAlreadyInUseError,
  FileMoveError,
  FileNotFoundError,
  ImageNotFoundError,
  UploadError,
} from "@/lib/errors";

export const GET = async (request: Request) => {
  const body = await request.json();
  const validatedBody = GetSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  const handler = async (request: Request): Promise<ConventionalResponse> => {
    const body = (await request.json()) as {
      key: string;
      public: boolean;
    };

    try {
      const data = await getImage(body);
      return ConventionalResponse.ok({ data });
    } catch (error) {
      if (error instanceof ImageNotFoundError) {
        return ConventionalResponse.notFound({
          message: "Imagem não encontrada.",
        });
      }

      return ConventionalResponse.internalServerError();
    }
  };

  return validatedBody.data.public
    ? handler(request)
    : adminAuthApiMiddleware(handler)(request);
};

export const POST = adminAuthApiMiddleware(async (request: Request) => {
  const body = await request.json();
  const validatedBody = PostSchema.safeParse(body);

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

    if (error instanceof UploadError) {
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

  const data = {
    ...validatedBody.data,
    newPublic:
      validatedBody.data.newPublic === undefined
        ? validatedBody.data.currentlyPublic
        : validatedBody.data.newPublic,
  };

  try {
    await moveImage(data);
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

    if (error instanceof FileMoveError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao mover a imagem.",
      });
    }

    if (error instanceof FileDeleteError) {
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
    await deleteImage(validatedBody.data);
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Imagem não encontrada.",
      });
    }

    if (error instanceof FileDeleteError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao deletar a imagem.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
});
