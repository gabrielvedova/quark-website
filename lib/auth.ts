import { ConventionalResponse } from "./responses";
import { isAdminAuthenticated } from "./session";

export function restrictAccessMiddleware(
  handler: (request: Request) => Promise<ConventionalResponse>
) {
  return async function (request: Request) {
    if (request.headers.get("origin") !== new URL(request.url).origin) {
      return ConventionalResponse.unauthorized();
    }

    return handler(request);
  };
}

export function adminAuthApiMiddleware(
  handler: (request: Request) => Promise<ConventionalResponse>
) {
  return async function (request: Request): Promise<ConventionalResponse> {
    if (!(await isAdminAuthenticated())) {
      return ConventionalResponse.unauthorized();
    }

    return handler(request);
  };
}

export function protectUnpublishedPosts(
  handler: (request: Request) => Promise<ConventionalResponse>
) {
  return async function (request: Request): Promise<ConventionalResponse> {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const isProtected = searchParams.get("published") !== "true";

    if (isProtected && !(await isAdminAuthenticated())) {
      return ConventionalResponse.unauthorized({
        message: "Autentique-se para acessar os posts não publicados.",
      });
    }

    return handler(request);
  };
}
