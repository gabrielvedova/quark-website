import { createPost, deletePost, getPosts, updatePost } from "@/lib/posts";
import {
  convertGetParams,
  DeleteSchema,
  GetParamsSchema,
  PostSchema,
  PutSchema,
} from "./schema";
import { NotFoundError, UnauthorizedError } from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { withAuth, withGetPostsAuth } from "@/lib/auth";

/**
 * Get a list of posts.
 *
 * @param request.url.searchParams.id The ID of the post to retrieve.
 * @param request.url.searchParams.search The search query to filter posts by.
 * @param request.url.searchParams.published Filter posts by their published status.
 *
 * @returns 200 - The list of posts that match the search query.
 * @returns 400 - { error: validatedParams.error.flatten() }
 * @returns 401 - { message: "Não autorizado." }
 */
export const GET = withGetPostsAuth(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const paramsObject = Object.fromEntries(searchParams);
  const validatedParams = GetParamsSchema.safeParse(paramsObject);

  if (!validatedParams.success) {
    return ConventionalResponse.badRequest({
      error: validatedParams.error.flatten(),
    });
  }

  const params = convertGetParams(validatedParams.data);
  const data = await getPosts(params);
  return ConventionalResponse.ok({ data });
});

/**
 * Create a new post.
 *
 * @param request.body.title The title of the post.
 * @param request.body.content The content of the post.
 * @param request.body.published The published status of the post.
 * @param request.body.miniature The miniature of the post.
 *
 * @returns 201 - { id }
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 401 - { message: "Não autorizado." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const POST = withAuth(async (request: Request) => {
  const body = await request.json();
  const validatedBody = PostSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten(),
    });
  }

  try {
    const id = await createPost(validatedBody.data);
    return ConventionalResponse.created({ data: { id } });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return ConventionalResponse.unauthorized();
    }

    return ConventionalResponse.internalServerError();
  }
});

/**
 * Modify a post.
 *
 * @param request.body.id The ID of the post to modify.
 * @param request.body.title The new title of the post.
 * @param request.body.content The new content of the post.
 * @param request.body.miniature The new miniature of the post.
 * @param request.body.published The new published status of the post.
 *
 * @returns 204
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 401 - { message: "Não autorizado." }
 * @returns 404 - { message: "Post não encontrado." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const PUT = withAuth(async (request: Request) => {
  const body = await request.json();
  const validatedBody = PutSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten(),
    });
  }

  try {
    await updatePost(validatedBody.data);
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return ConventionalResponse.notFound({ message: "Post não encontrado." });
    }

    return ConventionalResponse.internalServerError();
  }
});

/**
 * Delete a post.
 *
 * @param request.body.id The ID of the post to delete.
 *
 * @returns 204
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 401 - { message: "Não autorizado." }
 * @returns 404 - { message: "Post não encontrado." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const DELETE = withAuth(async (request: Request) => {
  const body = await request.json();
  const validatedBody = DeleteSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten(),
    });
  }

  try {
    await deletePost(validatedBody.data);
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return ConventionalResponse.notFound({ message: "Post não encontrado." });
    }

    return ConventionalResponse.internalServerError();
  }
});
