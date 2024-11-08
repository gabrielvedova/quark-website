import {
  createPost,
  deletePost,
  getPosts,
  getPostsMiddleware,
  updatePost,
} from "@/lib/posts";
import {
  convertGetParams,
  DeleteSchema,
  GetParamsSchema,
  PostSchema,
  PutSchema,
} from "./schema";
import { NotFoundError, UnauthorizedError } from "@/lib/errors";

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
export async function GET(request: Request) {
  // Protects unpublished posts
  const unauthorized = await getPostsMiddleware(request);
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(request.url);
  const paramsObject = Object.fromEntries(searchParams);
  const validatedParams = GetParamsSchema.safeParse(paramsObject);

  if (!validatedParams.success) {
    return new Response(
      JSON.stringify({ error: validatedParams.error.flatten() }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const params = convertGetParams(validatedParams.data);
  const result = await getPosts(params);
  return Response.json(result);
}

/**
 * Create a new post.
 *
 * @requiresAuthentication
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
export async function POST(request: Request) {
  const body = await request.json();
  const validatedBody = PostSchema.safeParse(body);

  if (!validatedBody.success) {
    return new Response(
      JSON.stringify({ error: validatedBody.error.flatten() }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const id = await createPost(validatedBody.data);
    return new Response(JSON.stringify({ id }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return new Response(JSON.stringify({ message: "Não autorizado." }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Modify a post.
 *
 * @requiresAuthentication
 *
 * @param request.body.id The ID of the post to modify.
 * @param request.body.title The new title of the post.
 * @param request.body.content The new content of the post.
 * @param request.body.miniature The new miniature of the post.
 * @param request.body.published The new published status of the post.
 *
 * @returns 204
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 404 - { message: "Post não encontrado." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export async function PUT(request: Request) {
  const body = await request.json();
  const validatedBody = PutSchema.safeParse(body);

  if (!validatedBody.success) {
    return new Response(
      JSON.stringify({ error: validatedBody.error.flatten() }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    await updatePost(validatedBody.data);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return new Response(JSON.stringify({ message: "Post não encontrado." }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Delete a post.
 *
 * @requiresAuthentication
 *
 * @param request.body.id The ID of the post to delete.
 *
 * @returns 204
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 404 - { message: "Post não encontrado." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export async function DELETE(request: Request) {
  const body = await request.json();
  const validatedBody = DeleteSchema.safeParse(body);

  if (!validatedBody.success) {
    return new Response(
      JSON.stringify({ error: validatedBody.error.flatten() }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    await deletePost(validatedBody.data);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return new Response(JSON.stringify({ message: "Post não encontrado." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
