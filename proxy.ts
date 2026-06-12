import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const checkToken = request.cookies.get("velvetTokken")?.value;

  if (!checkToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const pathname = request.nextUrl.pathname;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(checkToken, secret);

    const userRole = payload.role as string;

    if (pathname.startsWith("/admin")) {
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    if (pathname.startsWith("/point-of-sale")) {
      if (userRole !== "admin" && userRole !== "employee") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/point-of-sale/:path*"]
};
