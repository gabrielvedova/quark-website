import { createNews, getNews } from "@/lib/quark-na-midia";
import { convertGetParams, GetParamsSchema, PostSchema } from "./schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paramsObject = Object.fromEntries(searchParams);
  const validatedParams = GetParamsSchema.safeParse(paramsObject);

  if (!validatedParams.success) {
    return new Response(JSON.stringify(validatedParams.error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
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
    return new Response(JSON.stringify(validatedBody.error), {
      status: 400,
      headers: {
        "content-type": "application/json",
      },
    });
  }

  const id = await createNews(validatedBody.data);
  return new Response(JSON.stringify({ id }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}
