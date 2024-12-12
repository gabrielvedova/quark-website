import createAdmin from "@/lib/create-admin";
import { PostSchema } from "./schema";
import {
  UsernameInUseError,
  PasswordMismatchError,
  FileUploadError,
  UnauthorizedError,
} from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { adminAuthApiMiddleware } from "@/lib/auth";

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
