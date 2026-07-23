import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { iEmployee } from "./model/Employee.Model";
import { AppRoles } from "./lib/store/Api-Hooks/main.api";

export async function proxy(request: NextRequest) {




  const checkToken = request.cookies.get("velvetTokken")?.value;

  if (!checkToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const pathname = request.nextUrl.pathname;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(checkToken, secret);

    const userRole  = payload.role as iEmployee['role'];


    

    if (pathname.startsWith("/branchmanager")) {
      if (userRole !== AppRoles.BRANCH_MANAGER) {
        return NextResponse.redirect(new URL('/',request.url))
      }
    }






    if (pathname.startsWith("/martinventory")) {
      if (userRole === AppRoles.BRANCH_MANAGER || userRole === AppRoles.INVENTORY_MANAGER) {
        return NextResponse.next()
      }else {
        return NextResponse.redirect(new URL('/',request.url))
      }
    }





    if (pathname.startsWith("/point-of-sale")) {
      if (userRole === AppRoles.BRANCH_MANAGER || userRole === AppRoles.CASHIER) {
        return NextResponse.next()
      }else {
        return NextResponse.redirect(new URL('/',request.url))
      }
    }






    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url));  
  }
}

export const config = {
  matcher: ["/branchmanager/:path*", "/point-of-sale/:path*" , "/martinventory/:path*"]
};
