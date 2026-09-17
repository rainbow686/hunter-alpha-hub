import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APEX_HOST = "hunteralphahub.com";
const CANONICAL_HOST = "www.hunteralphahub.com";
const CANONICAL_HOSTS = new Set([APEX_HOST, CANONICAL_HOST]);

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.toLowerCase();

  if (host === APEX_HOST) {
    const canonicalUrl = `https://${CANONICAL_HOST}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const response = NextResponse.next();

  // Only the canonical host may be indexed. Preview and rollback hosts
  // (*.vercel.app, *.workers.dev, any other host) stay reachable but must not
  // compete with www in search results.
  if (host && CANONICAL_HOSTS.has(host)) {
    response.headers.set(
      "X-Robots-Tag",
      "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    );
  } else {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
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
