import { auth } from "@/auth";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname === "/login";
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");
  const isStaticAsset = req.nextUrl.pathname.match(
    /\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2)$/
  );

  // Allow auth API routes and static assets
  if (isAuthRoute || isStaticAsset) {
    return;
  }

  // Redirect to dashboard if already logged in and trying to access login
  if (isOnLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }

  // Allow login page access
  if (isOnLoginPage) {
    return;
  }

  // Allow API routes (they have their own auth handling)
  if (isApiRoute) {
    return;
  }

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon-.*|apple-icon).*)"],
};
