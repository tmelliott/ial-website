import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Handle /projects?page=X → rewrite to /projects/page/X (but keep URL as /projects?page=X)
  if (pathname === "/projects" && searchParams.has("page")) {
    const page = searchParams.get("page");
    if (page && page !== "1") {
      // Rewrite to the internal route but keep the original URL
      const url = request.nextUrl.clone();
      url.pathname = `/projects/page/${page}`;
      return NextResponse.rewrite(url);
    } else if (page === "1") {
      // Redirect /projects?page=1 to /projects (clean URL)
      const url = request.nextUrl.clone();
      url.pathname = "/projects";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/projects",
};
