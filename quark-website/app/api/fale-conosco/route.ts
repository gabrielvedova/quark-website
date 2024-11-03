import { PostSchema } from "./schema";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: Request) {
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
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
