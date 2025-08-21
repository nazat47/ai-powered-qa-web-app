import { NextRequest } from "next/server";

const DEFAULT_REDIRECT_URL = "/";

export default function authMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isLoggedIn = req.cookies.get("__$token__");
  const isAuthRoute =
    pathname.endsWith("/login") || pathname.endsWith("/signup");
  const isProtectedRoute = !isAuthRoute;

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_REDIRECT_URL, req.nextUrl));
    }
    return null;
  }
  if (isProtectedRoute && !isLoggedIn) {
    return Response.redirect(new URL(`/login`, req.nextUrl));
  }
  return null;
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
