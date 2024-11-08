import { getNews } from "@/lib/quark-na-midia";
import { convertGetParams, GetParamsSchema } from "./schema";

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

export async function POST(request: Request) {}

export async function PUT(request: Request) {}

export async function DELETE(request: Request) {}
