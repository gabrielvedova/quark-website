import { createPost, getPosts } from "@/lib/posts";
import { convertGetParams, GetParamsSchema, PostSchema } from "./schema";

export async function GET(request: Request) {
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
      return new Response("Unauthorized", { status: 401 });
    }
  }
}

/**
 * @requiresAuthentication
 */
export async function PUT(request: Request) {}

/**
 * @requiresAuthentication
 */
export async function DELETE(request: Request) {}
