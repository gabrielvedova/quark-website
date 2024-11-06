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
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const validatedPostData = PostSchema.safeParse(body);

  if (!validatedPostData.success) {
    return new Response(
      JSON.stringify({
        error: validatedPostData.error.errors.map((err) => err.message),
      }),
      { status: 400 }
    );
  }

  try {
    const { name, email, phoneNumber, institution } = validatedPostData.data;
    const emailResult = await sendContactEmail(
      name,
      email,
      phoneNumber,
      institution
    );

    return Response.json({
      message: `Email successfully sent to ${emailResult.accepted.join(", ")}`,
    });
  } catch (err) {
    return new Response("Internal server error", {
      status: 500,
    });
  }
}
