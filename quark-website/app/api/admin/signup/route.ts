import signup from "@/lib/signup";
import { PostSchema } from "./schema";
import { checkAuth } from "@/lib/auth";

export async function POST(request: Request) {
  const unauthorized = await checkAuth();
  if (unauthorized) return unauthorized;

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

  const { name, role, email, password } = validatedBody.data;
  const result = await signup(name, role, email, password);

  if (result?.error) {
    return new Response(JSON.stringify({ error: result.error }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
