import { adminAuthApiMiddleware } from "@/lib/auth";
import { UnauthorizedError } from "@/lib/errors";
import logout from "@/lib/logout";
import { ConventionalResponse } from "@/lib/responses";

export const OPTIONS = async () => {
  return ConventionalResponse.ok({ data: { methods: ["POST"] } });
};

export const POST = adminAuthApiMiddleware(async (request: Request) => {
  try {
    await logout();
    return ConventionalResponse.noContent();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return ConventionalResponse.unauthorized();
    }
    return ConventionalResponse.internalServerError();
  }
});
