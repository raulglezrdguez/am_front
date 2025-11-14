import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Lang, SUPPORTED_LOCALES } from "./types/languages";

function getPreferredLocale(req: NextRequest): string {
  // cookie locale
  const cookieLocale = req.cookies.get("locale")?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as Lang)) {
    return cookieLocale;
  }

  // Accept-Language header
  const accept = req.headers.get("accept-language");
  if (!accept) return "en";
  const langs = accept
    .split(",")
    .map((s) => s.split(";")[0].trim())
    .filter(Boolean);

  for (const l of langs) {
    // try full tag first (e.g. en-US), then base language (en)
    if (SUPPORTED_LOCALES.includes(l as Lang)) return l;
    const base = l.split("-")[0];
    if (SUPPORTED_LOCALES.includes(base as Lang)) return base;
  }

  return "en";
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // dentro de middleware, antes de redirigir -> permitir callbacks OAuth
  const oauthParams = [
    "state",
    "code",
    "error",
    "oauth_token",
    "firebaseError",
  ];
  for (const p of oauthParams) {
    if (url.searchParams.has(p)) {
      return NextResponse.next();
    }
  }

  // If the path already starts with a supported locale, don't redirect
  const firstSegment = pathname.split("/")[1];
  if (firstSegment && SUPPORTED_LOCALES.includes(firstSegment as Lang)) {
    return NextResponse.next();
  }

  // Only redirect the root path `/` to a locale; leave other paths alone
  if (pathname === "/" || pathname === "") {
    const locale = getPreferredLocale(req);
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// run middleware for all routes except Next internals and static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|_next|api|static|favicon.ico).*)"],
};
