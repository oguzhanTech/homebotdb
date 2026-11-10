import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAdminSessionCookieName,
  verifyAdminSessionToken,
} from "@/lib/admin-session";
import {
  CONSENT_REGION_COOKIE,
  CONSENT_REGION_COOKIE_MAX_AGE_SECONDS,
  CONSENT_REGION_HEADER,
  getConsentRegionFromCountry,
  type ConsentRegion,
} from "@/lib/consent/consentRegion";

function setConsentCookieIfNeeded(
  request: NextRequest,
  response: NextResponse,
  region: ConsentRegion,
): NextResponse {
  const existing = request.cookies.get(CONSENT_REGION_COOKIE)?.value;
  if (existing !== region) {
    response.cookies.set(CONSENT_REGION_COOKIE, region, {
      path: "/",
      sameSite: "lax",
      maxAge: CONSENT_REGION_COOKIE_MAX_AGE_SECONDS,
    });
  }
  response.headers.set(CONSENT_REGION_HEADER, region);
  return response;
}

function nextWithConsentRegion(request: NextRequest, region: ConsentRegion): NextResponse {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(CONSENT_REGION_HEADER, region);
  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  return setConsentCookieIfNeeded(request, response, region);
}

export async function middleware(request: NextRequest) {
  const region = getConsentRegionFromCountry(request.headers.get("x-vercel-ip-country"));
  const { pathname } = request.nextUrl;
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin && pathname !== "/admin/login") {
    const token = request.cookies.get(getAdminSessionCookieName())?.value;
    const valid = await verifyAdminSessionToken(token);
    if (!valid) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("next", pathname);
      return setConsentCookieIfNeeded(request, NextResponse.redirect(loginUrl), region);
    }
  }

  return nextWithConsentRegion(request, region);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
