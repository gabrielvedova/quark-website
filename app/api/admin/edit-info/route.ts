import { updateAdminInfo } from "@/lib/edit-admin-info";
import { PutSchema } from "./schema";
import {
  FileDeletionError,
  FileNotFoundError,
  FileUploadError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { adminAuthApiMiddleware } from "@/lib/auth";

export const PUT = adminAuthApiMiddleware(async (request: Request) => {
  const requestMetadata = { origin: new URL(request.url).origin };

  const body = await request.json();
  const validatedBody = await PutSchema.safeParseAsync(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await updateAdminInfo(validatedBody.data, requestMetadata);
    return ConventionalResponse.ok({
      message: "Informações alteradas com sucesso.",
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return ConventionalResponse.unauthorized();
    }

    if (error instanceof NotFoundError) {
      return ConventionalResponse.notFound({
        message: "Perfil não encontrado",
      });
    }

    if (error instanceof FileNotFoundError) {
      return ConventionalResponse.notFound({
        message: "Foto de perfil antiga não encontrada",
      });
    }

    if (error instanceof FileDeletionError) {
      return ConventionalResponse.internalServerError({
        message: error.message,
      });
    }

    if (error instanceof FileUploadError) {
      return ConventionalResponse.internalServerError({
        message: error.message,
      });
    }

    return ConventionalResponse.internalServerError();
  }
});
