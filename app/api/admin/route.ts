import {
  FileDeletionError,
  FileNotFoundError,
  FileUploadError,
  NotFoundError,
  UnauthorizedError,
  UsernameInUseError,
  PasswordMismatchError,
} from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { adminAuthApiMiddleware } from "@/lib/auth";
import {
  createAdmin,
  deleteAccount,
  getAdminInfo,
  updateAdminInfo,
} from "@/lib/admin";
import { PostSchema, PutSchema } from "./schema";

export const GET = adminAuthApiMiddleware(async (request: Request) => {
  const requestMetadata = { origin: new URL(request.url).origin };

  try {
    const admin = await getAdminInfo(requestMetadata);
    return ConventionalResponse.ok({ data: { admin } });
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
        message: "Foto de perfil não encontrada",
      });
    }

    return ConventionalResponse.internalServerError();
  }
});

export const POST = adminAuthApiMiddleware(async (request: Request) => {
  const requestMetadata = { origin: new URL(request.url).origin };

  const body = await request.json();
  const validatedBody = await PostSchema.safeParseAsync(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await createAdmin(validatedBody.data, requestMetadata);
    return ConventionalResponse.created({
      message: "Admin criado com sucesso.",
    });
  } catch (error) {
    if (error instanceof PasswordMismatchError) {
      return ConventionalResponse.badRequest({
        error: { passwordConfirmation: ["As senhas não coincidem."] },
      });
    }

    if (error instanceof UsernameInUseError) {
      return ConventionalResponse.conflict({
        error: { email: ["Nome de usuário já em uso"] },
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
