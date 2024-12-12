import { createPost, deletePost, getPosts, updatePost } from "@/lib/posts";
import {
  convertGetParams,
  DeleteSchema,
  GetParamsSchema,
  PostSchema,
  PutSchema,
} from "./schema";
import {
  FileDeletionError,
  FileNotFoundError,
  FileUploadError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { adminAuthApiMiddleware, protectUnpublishedPosts } from "@/lib/auth";

export const GET = protectUnpublishedPosts(async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const requestMetadata = { origin };
  const paramsObject = Object.fromEntries(searchParams);
  const validatedParams = GetParamsSchema.safeParse(paramsObject);

  if (!validatedParams.success) {
    return ConventionalResponse.badRequest({
      error: validatedParams.error.flatten().fieldErrors,
    });
  }

  const params = convertGetParams(validatedParams.data);

  try {
    const data = await getPosts(params, requestMetadata);
    return ConventionalResponse.ok({ data });
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({ message: error.message });
    }

    return ConventionalResponse.internalServerError();
  }
});

export const POST = adminAuthApiMiddleware(async (request: Request) => {
  const requestMetadata = { origin: new URL(request.url).origin };

  const body = await request.json();
  const validatedBody = await PostSchema.safeParseAsync(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    const id = await createPost(validatedBody.data, requestMetadata);
    return ConventionalResponse.created({ data: { id } });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return ConventionalResponse.unauthorized();
    }

    if (error instanceof FileUploadError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao fazer upload da imagem.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
});

export const PUT = adminAuthApiMiddleware(async (request: Request) => {
  const requestMetadata = { origin: new URL(request.url).origin };

  const body = await request.json();
  const validatedBody = await PutSchema.safeParseAsync(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await updatePost(validatedBody.data, requestMetadata);
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return ConventionalResponse.notFound({ message: "Post não encontrado." });
    }

    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Miniatura antiga não encontrada.",
      });
    }

    if (error instanceof FileDeletionError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao deletar a miniatura antiga.",
      });
    }

    if (error instanceof FileUploadError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao fazer upload da imagem.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
});

export const PATCH = PUT;

export const DELETE = adminAuthApiMiddleware(async (request: Request) => {
  const requestMetadata = { origin: new URL(request.url).origin };

  const body = await request.json();
  const validatedBody = DeleteSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await deletePost(validatedBody.data, requestMetadata);
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return ConventionalResponse.notFound({ message: "Post não encontrado." });
    }

    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Miniatura não encontrada.",
      });
    }

    if (error instanceof FileDeletionError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao deletar a miniatura.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
});
