import createAdmin from "@/lib/create-admin";
import { PostSchema } from "./schema";
import { EmailInUseError, PasswordMismatchError } from "@/lib/errors";

/**
 * Create a new admin account.
 *
 * @requiresAuthentication
 *
 * @param request.body.name The name of the admin.
 * @param request.body.role The role of the admin.
 * @param request.body.email The email of the admin.
 * @param request.body.password The password of the admin.
 * @param request.body.passwordConfirmation The password of the admin, confirmed.
 *
 * @returns 200 - { message: "Admin criado com sucesso." }
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 400 - { error: { passwordConfirmation: ["As senhas não coincidem."] } }
 * @returns 409 - { error: { email: ["Email já em uso."] } }
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
    await createAdmin(validatedBody.data);
  } catch (error) {
    if (error instanceof PasswordMismatchError) {
      return new Response(
        JSON.stringify({
          error: { passwordConfirmation: ["As senhas não coincidem."] },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error instanceof EmailInUseError) {
      return new Response(
        JSON.stringify({ error: { email: ["Email já em uso."] } }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
