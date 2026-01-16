import Negotiator from "negotiator";
import { type NextRequest, NextResponse } from "next/server";

import { defaultLocale, isValidLocale, type Locale, locales } from "@/lib/i18n";

const protectedRoutes = ["/my-campaign", "/profile"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}/`, request.url));
  }

  // Allow SEO files and manifest to bypass locale routing
  const seoFiles = ["/sitemap.xml", "/robots.txt", "/site.webmanifest"];
  if (seoFiles.includes(pathname)) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);

  const pathnameHasLocale = locales.some((locale) => {
    return segments[0] === locale || pathname === `/${locale}`;
  });

  if (!pathnameHasLocale) {
    const locale = getRequestLocale(request.headers);
    const redirectPath = "/" + [locale, ...segments].filter(Boolean).join("/");
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  const currentLocale = getCurrentLocale(pathname);
  const pathWithoutLocale = getPathWithoutLocale(pathname);

  const isProtectedRoute = protectedRoutes.includes(pathWithoutLocale);
  const token = request.cookies.get("token")?.value;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(
      new URL(`/${currentLocale}/login`, request.url)
    );
  }

  if (pathWithoutLocale === "/login" && !!token) {
    return NextResponse.redirect(new URL(`/${currentLocale}`, request.url));
  }

  // Add pathname to headers for lang attribute detection in root layout
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  return response;
}

function getRequestLocale(requestHeaders: Headers): Locale {
  const langHeader = requestHeaders.get("accept-language") || undefined;
  const languages = new Negotiator({
    headers: { "accept-language": langHeader },
  }).languages(locales.slice());

  const preferredLocale = languages[0];
  return isValidLocale(preferredLocale) ? preferredLocale : defaultLocale;
}

function getCurrentLocale(pathname: string): Locale {
  const segments = pathname.split("/");
  const potentialLocale = segments[1];
  return isValidLocale(potentialLocale) ? potentialLocale : defaultLocale;
}

function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && isValidLocale(segments[0])) {
    const without = segments.slice(1).join("/");
    return "/" + without;
  }
  return pathname;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
