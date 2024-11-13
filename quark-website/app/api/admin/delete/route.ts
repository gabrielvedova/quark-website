import { withAuth } from "@/lib/auth";
import deleteAccount from "@/lib/delete-admin";
import { UnauthorizedError } from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";

/**
 * Delete the current user account.
 *
 * @returns 204
 * @returns 401 - { message: "Não autorizado." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const DELETE = withAuth(async (request: Request) => {
  try {
    await deleteAccount();
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return ConventionalResponse.unauthorized();
    }

    return ConventionalResponse.internalServerError();
  }
});
