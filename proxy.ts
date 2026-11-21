import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "Tesazmare.Admin.Auth";

const API_URL = process.env.TESAZMARE_API_URL || "http://localhost:5050";

export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const cookie = request.cookies.get(COOKIE_NAME)?.value;

  let isAuthenticated = false;

  if (cookie) {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: "GET",
        headers: {
          Cookie: `${COOKIE_NAME}=${cookie}`,
        },
        cache: "no-store",
      });

      isAuthenticated = response.ok;
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
