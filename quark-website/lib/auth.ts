import { getSession } from "./session";

export async function checkAuth() {
  if (!(await getSession())) {
    return new Response(null, { status: 401, statusText: "Unauthorized" });
  }

  return null;
}
