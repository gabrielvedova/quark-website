import { getSession } from "./lib/session";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const protectedRoutes = ["/admin"];
  const protectedApiRoutes = ["/api/admin"];
  const session = await getSession();
  const path = new URL(request.url).pathname;

  const isProtectedRoute = protectedRoutes.some((route) => {
    return path.startsWith(route);
  });

  const isProtectedApiRoute = protectedApiRoutes.some((route) => {
    return path.startsWith(route);
  });

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProtectedApiRoute && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}
