import logout from "@/lib/logout";

/**
 * Log out the current user.
 *
 * @requiresAuthetication
 *
 * @returns 204
 */
export async function POST(request: Request) {
  await logout();

  return new Response(null, { status: 204 });
}
