import login from "@/lib/login";
import { PostSchema } from "./schema";

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
    await login(validatedBody.data);

    return new Response(
      JSON.stringify({ message: "Login efetuado com sucesso." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Email or password incorrect"
    ) {
      return new Response(
        JSON.stringify({ message: "Email ou senha incorretos." }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
