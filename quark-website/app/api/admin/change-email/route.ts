import { updateEmail } from "@/lib/change-email";
import { PutSchema } from "./schema";

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
          "content-type": "application/json",
        },
      }
    );
  }

  try {
    await updateEmail(validatedBody.data);
    return Response.json({ message: "Email alterado com sucesso." });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Não autorizado." }), {
        status: 401,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    if (error instanceof Error && error.message === "Not found") {
      return new Response(
        JSON.stringify({ message: "Usuário não encontrado" }),
        { status: 404, headers: { "content-type": "application/json" } }
      );
    }

    if (
      error instanceof Error &&
      error.message === "Current email is incorrect"
    ) {
      return new Response(
        JSON.stringify({ error: { email: ["Email incorreto."] } }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    if (error instanceof Error && error.message === "Emails do not match") {
      return new Response(
        JSON.stringify({
          error: { newEmailConfirmation: ["Os emails não coincidem."] },
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    if (error instanceof Error && error.message === "Email already in use") {
      return new Response(
        JSON.stringify({ error: { newEmail: ["Email já em uso"] } }),
        { status: 409, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: { message: "Ocorreu um erro." } }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
