import {
  createHeadline,
  deleteHeadline,
  getHeadline,
  updateHeadline,
} from "@/lib/quark-na-midia";
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
} from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { adminAuthApiMiddleware } from "@/lib/auth";

export const OPTIONS = async () => {
  return ConventionalResponse.ok({
    data: { methods: ["GET", "POST", "PUT", "DELETE"] },
  });
};

export const GET = async (request: Request) => {
  const { searchParams, origin } = new URL(request.url);
  const requestMetadata = { origin };
  const paramsObject = Object.fromEntries(searchParams);
  const validatedParams = GetParamsSchema.safeParse(paramsObject);

  if (!validatedParams.success) {
    return ConventionalResponse.badRequest({
      error: validatedParams.error.flatten(),
    });
  }

  const params = convertGetParams(validatedParams.data);

  try {
    const data = await getHeadline(params, requestMetadata);
    return ConventionalResponse.ok({ data });
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Miniatura da manchete não encontrada.",
      });
    }

    return ConventionalResponse.internalServerError(
      error instanceof Error ? { message: error.message } : undefined
    );
  }
};

export const POST = adminAuthApiMiddleware(async (request: Request) => {
  const requestMetadata = { origin: new URL(request.url).origin };

  const body = await request.json();
  const validatedBody = await PostSchema.safeParseAsync(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten(),
    });
  }

  try {
    const id = await createHeadline(validatedBody.data, requestMetadata);
    return ConventionalResponse.created({ data: { id } });
  } catch (error) {
    if (error instanceof FileUploadError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao fazer o upload da miniatura.",
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
      error: validatedBody.error.flatten(),
    });
  }

  try {
    await updateHeadline(validatedBody.data, requestMetadata);
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return ConventionalResponse.notFound({
        message: "Manchete não encontrada",
      });
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

    return ConventionalResponse.internalServerError(
      error instanceof Error ? { message: error.message } : undefined
    );
  }
});

export const PATCH = PUT;

export const DELETE = adminAuthApiMiddleware(async (request: Request) => {
  const requestMetadata = { origin: new URL(request.url).origin };

  const body = await request.json();
  const validatedBody = DeleteSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten(),
    });
  }

  try {
    await deleteHeadline(validatedBody.data, requestMetadata);
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return ConventionalResponse.notFound({
        message: "Manchete não encontrada.",
      });
    }

    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Miniatura da manchete não encontrada.",
      });
    }

    if (error instanceof FileDeletionError) {
      return ConventionalResponse.internalServerError({
        message: "Ocorreu um erro ao deletar a miniatura da manchete.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
});
