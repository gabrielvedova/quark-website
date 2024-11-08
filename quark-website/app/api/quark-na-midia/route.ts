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
import { NotFoundError } from "@/lib/errors";

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
  const result = await getHeadline(params);
  return Response.json(result);
}

/**
 * Create a new headline.
 *
 * @requiresAuthentication
 *
 * @param request.body.title The title of the headline.
 * @param request.body.description The description of the headline.
 * @param request.body.miniature The miniature of the headline.
 * @param request.body.publishingDate The publishing date of the headline.
 * @param request.body.url The URL of the headline.
 *
 * @returns 201 - { id }
 * @returns 400 - { error: validatedBody.error.flatten() }
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

  const id = await createHeadline(validatedBody.data);
  return new Response(JSON.stringify({ id }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * Modify a headline.
 *
 * @requiresAuthentication
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
 * @returns 404 - { message: "Manchete não encontrada" }
 * @returns 500 - { message: "Ocorreu um erro." }
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
    await updateHeadline(validatedBody.data);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof NotFoundError) {
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

    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}

/**
 * Delete a headline.
 *
 * @requiresAuthentication
 *
 * @param request.body.id The ID of the headline to delete.
 *
 * @returns 204
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 404 - { message: "Manchete não encontrada" }
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
          "content-type": "application/json",
        },
      }
    );
  }

  try {
    await deleteHeadline(validatedBody.data);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof NotFoundError) {
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

    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
