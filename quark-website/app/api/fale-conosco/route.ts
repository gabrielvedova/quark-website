import { PostSchema } from "./schema";
import { sendContactEmail } from "@/lib/email";

/**
 * @requires request.headers.authorization
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
        error: validatedBody.error.errors.map((err) => err.message),
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
