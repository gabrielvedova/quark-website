import { PostSchema, sendContactEmail } from "@/utils/fale-conosco.utils";

export async function POST(request: Request) {
  const body = await request.json();
  const result = PostSchema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({ error: result.error.errors.map((err) => err.message) }),
      { status: 400 }
    );
  }

  try {
    const { name, email, phoneNumber, institution } = result.data;
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
    return new Response(JSON.stringify({ error: "Internal server " }), {
      status: 500,
    });
  }
}
