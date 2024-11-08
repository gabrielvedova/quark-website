import deleteAccount from "@/lib/delete-admin";
import { UnauthorizedError } from "@/lib/errors";

/**
 * Delete the current user account.
 *
 * @requiresAuthetication
 *
 * @returns 204
 * @returns 401 - { message: "Não autorizado." }
 * @returns 500 - { message: "Ocorreu um erro." }
 */
export async function DELETE(request: Request) {
  try {
    await deleteAccount();
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return new Response(JSON.stringify({ message: "Não autorizado." }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ message: "Ocorreu um erro." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
