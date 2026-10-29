import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME, verifyJWT } from "@/lib/jwt";

/**
 * Authentication & Authorization Proxy Middleware
 * Intercepts incoming requests to protect private routes, verify signed JWT tokens,
 * enforce role-based access control (RBAC), and forward verified identity headers.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Cryptographically verify JWT token (HS256)
  const payload = token ? await verifyJWT(token) : null;
  const isAuthenticated = Boolean(payload);

  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = pathname.startsWith("/student");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isStudentApiRoute = pathname.startsWith("/api/student");
  const isAuthPageRoute = pathname === "/login" || pathname === "/register";

  // 1. Handshake for Already-Authenticated Users on Login/Register
  if (isAuthPageRoute) {
    if (isAuthenticated && payload) {
      // Redirect to the appropriate role-based dashboard
      const targetUrl =
        payload.role === "ADMIN" ? "/admin" : "/student/dashboard";
      return NextResponse.redirect(new URL(targetUrl, request.url));
    }

    // If an invalid or expired token cookie was present, clear it cleanly
    if (token && !isAuthenticated) {
      const response = NextResponse.next();
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    return NextResponse.next();
  }

  // 2. Protect Private API Routes (/api/admin/* and /api/student/*)
  if (isAdminApiRoute || isStudentApiRoute) {
    if (!isAuthenticated || !payload) {
      const response = NextResponse.json(
        { error: "Unauthorized: Valid session required" },
        { status: 401 }
      );
      if (token) {
        response.cookies.delete(COOKIE_NAME);
      }
      return response;
    }

    // Role check for admin API
    if (isAdminApiRoute && payload.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Administrator role required" },
        { status: 403 }
      );
    }

    // Forward verified user headers to downstream API handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-email", payload.email);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-name", encodeURIComponent(payload.name));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 3. Protect Private Page Routes (/admin/* and /student/*)
  if (isAdminRoute || isStudentRoute) {
    // If not authenticated: clear any invalid token and redirect to main page or login
    if (!isAuthenticated || !payload) {
      // Clear token and redirect to main page or login with callbackUrl
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      const response = NextResponse.redirect(redirectUrl);

      // Ensure invalid or expired token is cleared
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    // Enforce Admin Role for /admin/*
    if (isAdminRoute && payload.role !== "ADMIN") {
      // If a student tries to access admin, redirect to their student dashboard
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }

    // Authentication & authorization succeeded: proxy verified headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId);
    requestHeaders.set("x-user-email", payload.email);
    requestHeaders.set("x-user-role", payload.role);
    requestHeaders.set("x-user-name", encodeURIComponent(payload.name));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/api/admin/:path*",
    "/api/student/:path*",
    "/login",
    "/register",
  ],
};
