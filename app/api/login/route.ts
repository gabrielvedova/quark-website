import login from "@/lib/login";
import { PostSchema } from "./schema";
import { IncorrectUsernameOrPasswordError } from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";

export const OPTIONS = async () => {
  return ConventionalResponse.ok({ data: { methods: ["POST"] } });
};

export const POST = async (request: Request) => {
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

    return ConventionalResponse.internalServerError({
      message: error instanceof Error ? error.message : "Ocorreu um erro.",
    });
  }
};
