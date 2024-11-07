import deleteAccount from "@/lib/delete-admin";

/**
 * @requiresAuthetication
 */
export async function DELETE(request: Request) {
  try {
    const result = await deleteAccount();
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return new Response(JSON.stringify({ message: "Não autorizado." }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}
