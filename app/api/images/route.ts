import { ConventionalResponse } from "@/lib/responses";
import { GetSchema, PostSchema } from "./schema";
import { adminAuthApiMiddleware } from "@/lib/auth";
import { getImage, uploadImage } from "@/lib/images";
import {
  FileKeyAlreadyInUseError,
  ImageAccessError,
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
      if (error instanceof ImageAccessError) {
        return ConventionalResponse.internalServerError({
          message: "Ocorreu um erro ao acessar a imagem.",
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
    const key = await uploadImage(validatedBody.data);

    return ConventionalResponse.created({ data: { key } });
  } catch (error) {
    if (error instanceof FileKeyAlreadyInUseError) {
      return ConventionalResponse.badRequest({
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
