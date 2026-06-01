import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublic = createRouteMatcher([
  "/",
  "/docs",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/auth/(.*)",
  "/dashboard/new",
  "/dashboard/new/(.*)",
  "/api/chat(.*)",
  "/api/health",
  "/api/scrape(.*)",
  "/api/sessions(.*)",
  "/api/sites/(.*)/config",
  "/api/webhooks/(.*)",
  "/widget.js",
]);

export default clerkMiddleware(async (auth, req) => {
  // SECURITY: TESTING_MODE bypasses Clerk auth — ONLY honored outside production.
  // If accidentally set in prod, log a warning and ignore it.
  if (process.env.TESTING_MODE === "true") {
    if (process.env.NODE_ENV !== "production") {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-pathname", req.nextUrl.pathname);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    // In production: refuse to bypass auth. Fall through to normal Clerk check.
    console.warn("[middleware] TESTING_MODE=true ignored in production");
  }

  if (!isPublic(req)) {
    await auth.protect();
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
