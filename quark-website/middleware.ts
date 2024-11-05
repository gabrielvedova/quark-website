import { getSession } from "./lib/session";
import { NextResponse } from "next/server";

export async function middleware(request: Request) {
  const protectedRoutes = ["/admin"];
  const session = await getSession();
  const path = new URL(request.url).pathname;

  const isProtectedRoute = protectedRoutes.some((route) => {
    return path.startsWith(route);
  });

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
