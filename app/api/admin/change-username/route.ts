import { updateUsername } from "@/lib/change-username";
import { PatchSchema } from "./schema";
import {
  UsernameInUseError,
  UsernameMismatchError,
  IncorrectPasswordError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { adminAuthApiMiddleware } from "@/lib/auth";

export const OPTIONS = async () => {
  return ConventionalResponse.ok({ data: { methods: ["PATCH"] } });
};

export const PATCH = adminAuthApiMiddleware(async (request: Request) => {
  const body = await request.json();
  const validatedBody = PatchSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await updateUsername(validatedBody.data);
    return ConventionalResponse.ok({ message: "Email alterado com sucesso." });
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

    if (error instanceof UsernameMismatchError) {
      return ConventionalResponse.badRequest({
        error: { newEmailConfirmation: ["Os emails não coincidem."] },
      });
    }

    if (error instanceof UsernameInUseError) {
      return ConventionalResponse.conflict({
        error: { newEmail: ["Email já em uso"] },
      });
    }

    return ConventionalResponse.internalServerError();
  }
});
