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
 * @requiresAuthentication
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
    return Response.json({ id });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Não autorizado." }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}

/**
 * @requiresAuthentication
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
    if (error instanceof Error && error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Não autorizado." }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (error instanceof Error && error.message === "Not found") {
      return new Response(JSON.stringify({ message: "Post não encontrado." }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}

/**
 * @requiresAuthentication
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
    if (error instanceof Error && error.message === "Not found") {
      return new Response(JSON.stringify({ message: "Post não encontrado." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}
