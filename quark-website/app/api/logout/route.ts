import { withAuth } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";
import logout from "@/lib/logout";
import { ConventionalResponse } from "@/lib/responses";

/**
 * Log out the current user.
 *
 * @returns 204
 * @returns 401 - { message: "Não autorizado." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const POST = withAuth(async (request: Request) => {
  try {
    await logout();
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return ConventionalResponse.unauthorized();
    }
    return ConventionalResponse.internalServerError();
  }
});
