import login from "@/lib/login";
import { PostSchema } from "./schema";
import { IncorrectEmailOrPasswordError } from "@/lib/errors";

/**
 * Log in an admin.
 *
 * @param request.body.email The email of the admin.
 * @param request.body.password The password of the admin.
 *
 * @returns 200 - { message: "Login efetuado com sucesso." }
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 401 - { message: "Email ou senha incorretos." }
 * @returns 500 - { message: "Ocorreu um erro." }
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
    if (error instanceof IncorrectEmailOrPasswordError) {
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
