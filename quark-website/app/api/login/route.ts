import login from "@/lib/login";
import { PostSchema } from "./schema";
import { IncorrectUsernameOrPasswordError } from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";

/**
 * Log in an admin.
 *
 * @param request.body.email The email of the admin.
 * @param request.body.password The password of the admin.
 *
 * @returns 200 - { message: "Login efetuado com sucesso." }
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 401 - { message: "Nome de usuário ou senha incorretos." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const POST = async (request: Request): Promise<ConventionalResponse> => {
  const body = await request.json();
  const validatedBody = PostSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await login(validatedBody.data);
    return ConventionalResponse.ok({ message: "Login efetuado com sucesso." });
  } catch (error) {
    if (error instanceof IncorrectUsernameOrPasswordError) {
      return ConventionalResponse.unauthorized({
        message: "Nome de usuário ou senha incorretos.",
      });
    }

    return ConventionalResponse.internalServerError();
  }
};
