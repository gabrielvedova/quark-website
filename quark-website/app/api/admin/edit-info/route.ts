import { updateAdminInfo } from "@/lib/edit-admin-info";
import { PutSchema } from "./schema";
import { NotFoundError, UnauthorizedError } from "@/lib/errors";
import { ConventionalResponse } from "@/lib/responses";
import { adminAuthApiMiddleware } from "@/lib/auth";

/**
 * Update the information of the current admin.
 *
 * @param request.body.name The new name of the admin.
 * @param request.body.role The new role of the admin.
 * @param request.body.profilePicture The new profile picture of the admin.
 *
 * @returns 200 - { message: "Informações alteradas com sucesso." }
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 401 - { message: "Não autorizado." }
 * @returns 404 - { message: "Perfil não encontrado" }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const PUT = adminAuthApiMiddleware(async (request: Request) => {
  const body = request.json();
  const validatedBody = PutSchema.safeParse(body);

  if (!validatedBody.success) {
    return ConventionalResponse.badRequest({
      error: validatedBody.error.flatten().fieldErrors,
    });
  }

  try {
    await updateAdminInfo(validatedBody.data);
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

    return ConventionalResponse.internalServerError();
  }
});
