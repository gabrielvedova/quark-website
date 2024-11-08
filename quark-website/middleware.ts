import { getSession } from "./lib/session";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  // Define protected page routes
  const protectedRoutes = ["/admin"];

  // Define protected API endpoints
  const protectedApiEndpoints = [
    { method: "PATCH", path: "/api/admin/change-email" },
    { method: "PATCH", path: "/api/admin/change-password" },
    { method: "POST", path: "api/admin/create" },
    { method: "DELETE", path: "/api/admin/delete" },
    { method: "POST", path: "/api/admin/edit-info" },
    { method: "GET", path: "api/admin/logout" },
    { method: "POST", path: "/api/blog/posts" },
    { method: "PUT", path: "/api/blog/posts" },
    { method: "DELETE", path: "/api/blog/posts" },
    { method: "POST", path: "/api/quark-na-midia" },
    { method: "PUT", path: "/api/quark-na-midia" },
    { method: "DELETE", path: "/api/quark-na-midia" },
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
    return new Response(JSON.stringify({ message: "Não autorizado." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // If the user is authenticated, or the route is not protected, proceed
  return NextResponse.next();
}
