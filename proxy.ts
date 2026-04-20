import { auth } from "@/auth";

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;

  // 👇 Get role from session/token
  const userRole = req.auth?.user?.role;

  const pathname = req.nextUrl.pathname;

  const isOnLoginPage = pathname === "/login";
  const isAuthRoute = pathname.startsWith("/api/auth");
  const isApiRoute = pathname.startsWith("/api");
  const isAdminRoute = pathname.startsWith("/admin"); // 👈 NEW
  const isStaticAsset = pathname.match(
    /\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2)$/,
  );

  // ✅ Allow auth routes & static files
  if (isAuthRoute || isStaticAsset) {
    return;
  }

  // ✅ If logged in and trying to go to login → redirect home
  if (isOnLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl.origin));
  }

  // ✅ Allow login page
  if (isOnLoginPage) {
    return;
  }

  // ✅ Allow API routes (you can secure them separately)
  if (isApiRoute) {
    return;
  }

  // ❌ Not logged in → redirect to login
  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }

  // 🔐 ADMIN PROTECTION (MAIN FEATURE 🔥)
  if (isAdminRoute) {
    if (userRole !== "ADMIN") {
      return Response.redirect(new URL("/unauthorized", req.nextUrl.origin));
    }
  }

  // ✅ Otherwise allow request
  return;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon-.*|apple-icon).*)"],
};
