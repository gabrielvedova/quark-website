import { updatePassword } from "@/lib/change-password";
import { PatchSchema } from "./schema";
import {
  IncorrectPasswordError,
  NotFoundError,
  PasswordMismatchError,
  UnauthorizedError,
} from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { withAuth } from "@/lib/auth";

/**
 * Update the password of the current user.
 *
 * @param request.body.password The current password of the user.
 * @param request.body.newPassword The new password of the user.
 * @param request.body.newPasswordConfirmation The new password of the user, confirmed.
 *
 * @returns 200 - { message: "Senha alterada com sucesso." }
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 400 - { error: { password: ["Senha incorreta."] } }
 * @returns 400 - { error: { newPasswordConfirmation: ["As senhas não coincidem."] } }
 * @returns 401 - { message: "Não autorizado." }
 * @returns 404 - { message: "Usuário não encontrado" }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const PATCH = withAuth(async (request: Request) => {
  const body = await request.json();
  const validatedBody = PatchSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten(),
    });
  }

  try {
    await updatePassword(validatedBody.data);
    return ConventionalResponse.ok({ message: "Senha alterada com sucesso." });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return ConventionalResponse.unauthorized();
    }

    if (error instanceof NotFoundError) {
      return ConventionalResponse.notFound({
        message: "Usuário não encontrado",
      });
    }

    if (error instanceof IncorrectPasswordError) {
      return ConventionalResponse.badRequest({
        error: { password: ["Senha incorreta."] },
      });
    }

    if (error instanceof PasswordMismatchError) {
      return ConventionalResponse.badRequest({
        error: { newPasswordConfirmation: ["As senhas não coincidem."] },
      });
    }

    return ConventionalResponse.internalServerError();
  }
});
