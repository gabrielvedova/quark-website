import { checkAuth } from "@/lib/auth";
import deleteAccount from "@/lib/delete-account";

export async function DELETE(request: Request) {
  const unauthorized = await checkAuth();
  if (unauthorized) return unauthorized;

  const result = await deleteAccount();
  return new Response(null, { status: result.status });
}
