import { updatePassword } from "@/lib/change-password";
import { PatchSchema } from "./schema";
import {
  IncorrectPasswordError,
  NotFoundError,
  PasswordMismatchError,
  UnauthorizedError,
} from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { adminAuthApiMiddleware } from "@/lib/auth";

export const PATCH = adminAuthApiMiddleware(async (request: Request) => {
  const body = await request.json();
  const validatedBody = PatchSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
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
