import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const APEX_HOST = "hunteralphahub.com";
const CANONICAL_HOST = "www.hunteralphahub.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");

  if (host && host.toLowerCase() === APEX_HOST) {
    const canonicalUrl = `https://${CANONICAL_HOST}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const response = NextResponse.next();

  // X-Robots-Tag header for all pages
  response.headers.set("X-Robots-Tag", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");

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
