import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Get the cookies
  const session = request.cookies.get("gfg_session");
  const role = request.cookies.get("gfg_role");

  // 2. Define protected routes
  const isProtectedRoute = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/admin") || 
    pathname.startsWith("/profile") || 
    pathname.startsWith("/events") || 
    pathname.startsWith("/projects/submit");

  // 3. Guard: Redirect to login if NO session and trying to access protected route
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. Admin Guard: Only 'admin' role can access /admin
  if (pathname.startsWith("/admin") && role?.value !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 5. Prevent double login: Redirect if logged in and trying to access /
  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL(role?.value === "admin" ? "/admin" : "/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
