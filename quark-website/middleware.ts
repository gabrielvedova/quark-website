import { getSession } from "./lib/session";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  // Define protected page routes
  const protectedRoutes = ["/admin"];

  // Define protected API endpoints
  const protectedApiEndpoints = [
    { method: "DELETE", path: "/api/admin/delete-account" },
    { method: "GET", path: "api/admin/logout" },
    { method: "POST", path: "api/admin/signup" },
    { method: "POST", path: "/api/blog/posts" },
    { method: "PUT", path: "/api/blog/posts" },
    { method: "DELETE", path: "/api/blog/posts" },
    { method: "POST", path: "/api/quark-na-midia" },
  ];

  const session = await getSession();
  const path = new URL(request.url).pathname;

  // Protect pages included in protectedRoutes
  if (protectedRoutes.some((route) => path.startsWith(route)) && !session) {
    return NextResponse.redirect("/login");
  }

  // Protect API endpoints included in protectedApiEndpoints
  if (
    protectedApiEndpoints.some(
      (endpoint) =>
        endpoint.method === request.method && path.startsWith(endpoint.path)
    ) &&
    !session
  ) {
    return new Response("Unauthorized", { status: 401 });
  }

  // If the user is authenticated, or the route is not protected, proceed
  return NextResponse.next();
}
