import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isAdminSurface(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api" ||
    pathname.startsWith("/api/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Admin deploy: serve Payload only. Send everything else to the public site.
  if (process.env.ADMIN_ONLY === "true") {
    if (isAdminSurface(pathname)) return NextResponse.next();

    if (pathname === "/") {
      const admin = request.nextUrl.clone();
      admin.pathname = "/admin";
      admin.search = "";
      return NextResponse.redirect(admin);
    }

    const site = process.env.NEXT_PUBLIC_URL;
    if (site) {
      return NextResponse.redirect(
        new URL(`${pathname}${request.nextUrl.search}`, site),
      );
    }

    const admin = request.nextUrl.clone();
    admin.pathname = "/admin";
    admin.search = "";
    return NextResponse.redirect(admin);
  }

  // Public site: editors should use the always-on admin host.
  const adminUrl = process.env.ADMIN_URL;
  if (
    adminUrl &&
    (pathname === "/admin" || pathname.startsWith("/admin/"))
  ) {
    return NextResponse.redirect(
      new URL(`${pathname}${request.nextUrl.search}`, adminUrl),
    );
  }

  // Handle /projects?page=X → rewrite to /projects/page/X (but keep URL as /projects?page=X)
  if (pathname === "/projects" && searchParams.has("page")) {
    const page = searchParams.get("page");
    if (page && page !== "1") {
      const url = request.nextUrl.clone();
      url.pathname = `/projects/page/${page}`;
      return NextResponse.rewrite(url);
    } else if (page === "1") {
      const url = request.nextUrl.clone();
      url.pathname = "/projects";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$).*)",
  ],
};
