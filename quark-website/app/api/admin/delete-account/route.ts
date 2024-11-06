import deleteAccount from "@/lib/delete-account";

/**
 * @requiresAuthetication
 */
export async function DELETE(request: Request) {
  try {
    const result = await deleteAccount();
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return new Response("Unauthorized", { status: 401 });
    }
  }
}
