import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If the user is not an admin and tries to access /admin routes
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
      // If it's the login page, let them through
      if (req.nextUrl.pathname === "/admin/login") {
        return;
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  // Protect /admin routes, but ignore NextAuth paths and login
  matcher: ["/admin/((?!login).*)"],
};
