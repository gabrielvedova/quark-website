import login from "@/app/lib/login";
import { PostSchema } from "./schema";

export async function POST(request: Request) {
  const body = await request.json();
  const validatedBody = PostSchema.safeParse(body);

  if (!validatedBody.success) {
    return new Response(
      JSON.stringify({ error: validatedBody.error.flatten() }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const { email, password } = validatedBody.data;
  const result = await login(email, password);

  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
