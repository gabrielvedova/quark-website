import {
  createNews,
  deleteNews,
  getNews,
  updateNews,
} from "@/lib/quark-na-midia";
import {
  convertGetParams,
  DeleteSchema,
  GetParamsSchema,
  PostSchema,
  PutSchema,
} from "./schema";

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
          "content-type": "application/json",
        },
      }
    );
  }

  const params = convertGetParams(validatedParams.data);
  const result = await getNews(params);
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
          "content-type": "application/json",
        },
      }
    );
  }

  const id = await createNews(validatedBody.data);
  return new Response(JSON.stringify({ id }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * @requiresAuthentication
 */
export async function PUT(request: Request) {
  const body = request.json();
  const validatedBody = PutSchema.safeParse(body);

  if (!validatedBody.success) {
    return new Response(
      JSON.stringify({ error: validatedBody.error.flatten() }),
      {
        status: 400,
        headers: {
          "content-type": "application/json",
        },
      }
    );
  }

  try {
    await updateNews(validatedBody.data);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Not found") {
      return new Response(
        JSON.stringify({ message: "Manchete não encontrada" }),
        {
          status: 404,
          headers: {
            "content-type": "application/json",
          },
        }
      );
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
          "content-type": "application/json",
        },
      }
    );
  }

  try {
    await deleteNews(validatedBody.data);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Not found") {
      return new Response(
        JSON.stringify({ message: "Manchete não encontrada" }),
        {
          status: 404,
          headers: {
            "content-type": "application/json",
          },
        }
      );
    }
  }
}
