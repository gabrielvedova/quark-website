import createAdmin from "@/lib/create-admin";
import { PostSchema } from "./schema";
import { EmailInUseError, PasswordMismatchError } from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { withAuth } from "@/lib/auth";

/**
 * Create a new admin account.
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
 * @returns 401 - { message: "Não autorizado." }
 * @returns 409 - { error: { email: ["Email já em uso."] } }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const POST = withAuth(async (request: Request) => {
  const body = await request.json();
  const validatedBody = PostSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten(),
    });
  }

  try {
    await createAdmin(validatedBody.data);
    return ConventionalResponse.created({
      message: "Admin criado com sucesso.",
    });
  } catch (error) {
    if (error instanceof PasswordMismatchError) {
      return ConventionalResponse.badRequest({
        error: { passwordConfirmation: ["As senhas não coincidem."] },
      });
    }

    if (error instanceof EmailInUseError) {
      return ConventionalResponse.conflict({
        error: { email: ["Email já em uso."] },
      });
    }

    return ConventionalResponse.internalServerError();
  }
});
