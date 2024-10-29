import { postSchema, sendContactEmail } from "@/utils/fale-conosco.utils";

export const POST = async (request: Request) => {
  const body = await request.json();
  const { error, value } = postSchema.validate(body);

  if (error) {
    return new Response(
      JSON.stringify({
        error: error.details.map((detail) => detail.message),
      }),
      { status: 400 }
    );
  }

  try {
    const result = await sendContactEmail(
      value.name,
      value.email,
      value.phoneNumber,
      value.institution
    );

    return new Response(
      JSON.stringify({
        message: `Email successfully sent to ${result.accepted.join(", ")}`,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
