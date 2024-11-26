import { ConventionalResponse } from "@/lib/responses";
import { PostSchema } from "./schema";
import { sendContactEmail } from "@/lib/email";
import { bearerAuthMiddleware } from "@/lib/auth";

/**
 * Send an email with the contact information.
 *
 * @param request.body.name The name of the person who is contacting.
 * @param request.body.email The email of the person who is contacting.
 * @param request.body.phoneNumber The phone number of the person who is contacting.
 * @param request.body.institution The institution of the person who is contacting.
 *
 * @returns 200 - { message: "Informações enviadas com sucesso." }
 * @returns 400 - { error: validatedBody.error.flatten() }
 * @returns 401 - { message: "Não autorizado." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export const POST = bearerAuthMiddleware(
  process.env.MAIL_API_SECRET,
  async (request: Request) => {
    const body = await request.json();
    const validatedBody = PostSchema.safeParse(body);

    if (!validatedBody.success) {
      return ConventionalResponse.badRequest({
        error: validatedBody.error.flatten().fieldErrors,
      });
    }

    try {
      await sendContactEmail(validatedBody.data);
      return ConventionalResponse.ok({
        message: "Informações enviadas com sucesso.",
      });
    } catch (err) {
      return ConventionalResponse.internalServerError();
    }
  }
);
