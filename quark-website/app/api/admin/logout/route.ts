import logout from "@/lib/logout";

/**
 * @requiresAuthetication
 */
export async function GET(request: Request) {
  const result = await logout();

  return new Response(null, { status: 204 });
}
