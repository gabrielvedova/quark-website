import { PostSchema } from "./schema";
import { sendContactEmail } from "@/lib/email";

/**
 * Send an email with the contact information.
 *
 * @requires request.headers.authorization
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
export async function POST(request: Request) {
  const unauthorized =
    request.headers.get("Authorization") !==
    `Bearer ${process.env.MAIL_API_SECRET}`;

  if (unauthorized) {
    return new Response(JSON.stringify({ message: "Não autorizado." }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const body = await request.json();
  const validatedBody = PostSchema.safeParse(body);

  if (!validatedBody.success) {
    return new Response(
      JSON.stringify({
        error: validatedBody.error.flatten(),
      }),
      { status: 400 }
    );
  }

  try {
    await sendContactEmail(validatedBody.data);

    return Response.json({
      message: "Informações enviadas com sucesso.",
    });
  } catch (err) {
    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
