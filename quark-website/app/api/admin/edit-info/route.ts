import { updateAdminInfo } from "@/lib/edit-admin-info";
import { PutSchema } from "./schema";
import { NotFoundError, UnauthorizedError } from "@/lib/errors";

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
    await updateAdminInfo(validatedBody.data);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return new Response(JSON.stringify({ message: "Não autorizado." }), {
        status: 401,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    if (error instanceof NotFoundError) {
      return new Response(
        JSON.stringify({ message: "Perfil não encontrado" }),
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
