import logout from "@/lib/logout";

/**
 * @requiresAuthetication
 */
export async function POST(request: Request) {
  await logout();

  return new Response(null, { status: 204 });
}
