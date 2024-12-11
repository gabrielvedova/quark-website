import { adminAuthApiMiddleware } from "@/lib/auth";
import deleteAccount from "@/lib/delete-admin";
import {
  FileDeletionError,
  FileNotFoundError,
  UnauthorizedError,
} from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";

/**
 * Delete the current user account.
 *
 * @returns 204
 * @returns 401 - { message: "Não autorizado." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const DELETE = adminAuthApiMiddleware(async (request: Request) => {
  try {
    await deleteAccount();
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return ConventionalResponse.unauthorized();
    }

    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Foto de perfil não encontrada durante a exclusão do perfil.",
      });
    }

    if (error instanceof FileDeletionError) {
      return ConventionalResponse.internalServerError({
        message: error.message,
      });
    }

    return ConventionalResponse.internalServerError();
  }
});
