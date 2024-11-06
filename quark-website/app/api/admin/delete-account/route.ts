import deleteAccount from "@/lib/delete-account";

/**
 * @requiresAuthetication
 */
export async function DELETE(request: Request) {
  const result = await deleteAccount();
  return new Response(null, { status: result.status });
}
