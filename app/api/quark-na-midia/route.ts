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

/**
 * Get a list of headlines.
 *
 * @param request.url.searchParams.id The ID of the headline to retrieve.
 *
 * @returns 200 - The list of headlines that match the search query.
 * @returns 400 - { error: validatedParams.error.flatten() }
 * @returns 401 - { message: "Não autorizado." }
 * @returns 404 - { message: "Manchete não encontrada" }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const GET = async (request: Request): Promise<ConventionalResponse> => {
  const { searchParams } = new URL(request.url);
  const paramsObject = Object.fromEntries(searchParams);
  const validatedParams = GetParamsSchema.safeParse(paramsObject);

  if (!validatedParams.success) {
    return ConventionalResponse.badRequest({
      error: validatedParams.error.flatten(),
    });
  }

  const params = convertGetParams(validatedParams.data);

  try {
    const data = await getHeadline(params);
    return ConventionalResponse.ok({ data });
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Miniatura da manchete não encontrada.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
};

/**
 * Create a new headline.
 *
 * @param request.body.title The title of the headline.
 * @param request.body.description The description of the headline.
 * @param request.body.miniature The miniature of the headline.
 * @param request.body.publishingDate The publishing date of the headline.
 * @param request.body.url The URL of the headline.
 *
 * @returns 201 - { id }
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 401 - { message: "Não autorizado." }
 */
export const POST = adminAuthApiMiddleware(async (request: Request) => {
  const body = await request.json();
  const validatedBody = await PostSchema.safeParseAsync(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten(),
    });
  }

  try {
    const id = await createHeadline(validatedBody.data);
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

/**
 * Modify a headline.
 *
 * @param request.body.id The ID of the headline to modify.
 * @param request.body.title The new title of the headline.
 * @param request.body.description The new description of the headline.
 * @param request.body.miniature The new miniature of the headline.
 * @param request.body.publishingDate The new publishing date of the headline.
 * @param request.body.url The new URL of the headline.
 *
 * @returns 204
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 401 - { message: "Não autorizado." }
 * @returns 404 - { message: "Manchete não encontrada" }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const PUT = adminAuthApiMiddleware(async (request: Request) => {
  const body = request.json();
  const validatedBody = await PutSchema.safeParseAsync(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten(),
    });
  }

  try {
    await updateHeadline(validatedBody.data);
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

    return ConventionalResponse.internalServerError();
  }
});

/**
 * Alias for PUT.
 *
 * Used to semantically update a single field of a headline.
 */
export const PATCH = PUT;

/**
 * Delete a headline.
 *
 * @param request.body.id The ID of the headline to delete.
 *
 * @returns 204
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 401 - { message: "Não autorizado." }
 * @returns 404 - { message: "Manchete não encontrada" }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const DELETE = adminAuthApiMiddleware(async (request: Request) => {
  const body = await request.json();
  const validatedBody = DeleteSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten(),
    });
  }

  try {
    await deleteHeadline(validatedBody.data);
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
