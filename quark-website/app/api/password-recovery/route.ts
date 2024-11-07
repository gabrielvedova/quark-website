import { initiatePasswordRecovery } from "@/lib/password-recovery";
import { PostSchema } from "./schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const validatedBody = PostSchema.safeParse(body);

  if (!validatedBody.success) {
    return new Response(
      JSON.stringify({ error: validatedBody.error.flatten() }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await initiatePasswordRecovery(validatedBody.data.email);

    // After sending the code via email, redirect to the verification page
    return NextResponse.redirect(
      `/esqueci-a-senha/verificacao?email=${validatedBody.data.email}`
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Not found") {
      return new Response(
        JSON.stringify({ message: "Usuário não encontrado" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return new Response(
        JSON.stringify({
          message:
            "Este usuário não pode receber códigos. Para ativá-lo, digite faça login com a senha correta.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof Error && error.message === "Failed to send email") {
      return new Response(
        JSON.stringify({
          message:
            "Ocorreu um erro ao enviar o email. Tente novamente mais tarde.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
