import { updatePassword } from "@/lib/change-password";
import { PatchSchema } from "./schema";
import {
  IncorrectPasswordError,
  PasswordMismatchError,
  UnauthorizedError,
} from "@/lib/errors";

export async function PATCH(request: Request) {
  const body = await request.json();
  const validatedBody = PatchSchema.safeParse(body);

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
    await updatePassword(validatedBody.data);
    return Response.json({ message: "Senha alterada com sucesso." });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return new Response(JSON.stringify({ message: "Não autorizado." }), {
        status: 401,
        headers: {
          "content-type": "application/json",
        },
      });
    }

    if (error instanceof UnauthorizedError) {
      return new Response(
        JSON.stringify({ message: "Usuário não encontrado" }),
        { status: 404, headers: { "content-type": "application/json" } }
      );
    }

    if (error instanceof IncorrectPasswordError) {
      return new Response(
        JSON.stringify({ error: { password: ["Senha incorreta."] } }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    if (error instanceof PasswordMismatchError) {
      return new Response(
        JSON.stringify({
          error: { newPasswordConfirmation: ["As senhas não coincidem."] },
        }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
