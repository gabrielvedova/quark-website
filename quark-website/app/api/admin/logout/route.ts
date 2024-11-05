import { checkAuth } from "@/lib/auth";
import logout from "@/lib/logout";

export async function GET(request: Request) {
  const unauthorized = await checkAuth();
  if (unauthorized) return unauthorized;

  const result = await logout();

  return new Response(JSON.stringify({ message: result.message }), {
    status: result.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
