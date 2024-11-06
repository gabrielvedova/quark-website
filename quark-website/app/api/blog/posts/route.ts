import { getPosts } from "@/lib/posts";
import { convertGetParams, GetParamsSchema } from "./schema";

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

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}
