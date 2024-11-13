import { ConventionalResponse } from "./responses";
import { isAdminAuthenticated } from "./session";

/**
 * Middleware that checks if the user is authenticated with a Bearer token.
 *
 * @param token - The Bearer token to be checked.
 * @param handler - The handler to be executed if the user is authenticated.
 *
 * @returns The handler if the user is authenticated, otherwise a 401 response.
 */
export function withBearerAuth(
  token: string | undefined,
  handler: (request: Request) => Promise<ConventionalResponse>
) {
  return async function (request: Request): Promise<ConventionalResponse> {
    if (!token) {
      return ConventionalResponse.internalServerError({
        message: "Token não definido.",
      });
    }

    if (request.headers.get("Authorization") !== `Bearer ${token}`) {
      return ConventionalResponse.unauthorized();
    }

    return handler(request);
  };
}

/**
 * Middleware that checks if the user is authenticated.
 *
 * @param handler - The handler to be executed if the user is authenticated.
 *
 * @returns The handler if the user is authenticated, otherwise a 401 response.
 */
export function withAuth(
  handler: (request: Request) => Promise<ConventionalResponse>
) {
  return async function (request: Request): Promise<ConventionalResponse> {
    if (!(await isAdminAuthenticated())) {
      return ConventionalResponse.unauthorized();
    }

    return handler(request);
  };
}

/**
 * Middleware that checks if the user is authenticated to access unpublished posts.
 *
 * @param handler - The handler to be executed if the user is authenticated.
 *
 * @returns The handler if the user is authenticated, otherwise a 401 response.
 */
export function withGetPostsAuth(
  handler: (request: Request) => Promise<ConventionalResponse>
) {
  return async function (request: Request): Promise<ConventionalResponse> {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    console.log(searchParams.get("published"));
    const isProtected = searchParams.get("published") !== "true";

    if (isProtected && !(await isAdminAuthenticated())) {
      return ConventionalResponse.unauthorized({
        message: "Autentique-se para acessar os posts não publicados.",
      });
    }

    return handler(request);
  };
}
