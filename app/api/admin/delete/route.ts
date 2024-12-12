import { adminAuthApiMiddleware } from "@/lib/auth";
import deleteAccount from "@/lib/delete-admin";
import {
  FileDeletionError,
  FileNotFoundError,
  UnauthorizedError,
} from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";

export const DELETE = adminAuthApiMiddleware(async (request: Request) => {
  const requestMetadata = { origin: new URL(request.url).origin };

  try {
    await deleteAccount(requestMetadata);
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
