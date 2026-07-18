import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("empnexa_token")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard") || 
                           request.nextUrl.pathname.startsWith("/employees") || 
                           request.nextUrl.pathname.startsWith("/organization") || 
                           request.nextUrl.pathname.startsWith("/profile");

  if (!token && isDashboardRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If there's a token but the user is on the login page, we can't fully know their role here 
  // (unless we decode the JWT, which is fine, but backend is source of truth).
  // The layout will redirect them if they try to access a page they shouldn't.
  // We can decode JWT manually if we want to redirect to the correct page from /login.
  if (token && isAuthPage) {
    try {
      // Basic base64 decode of payload to get role (Not verifying signature, just checking contents for routing)
      const payloadBase64 = token.split(".")[1];
      const payload = JSON.parse(atob(payloadBase64));
      
      const role = payload.role;
      if (role === "super_admin" || role === "hr_manager") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } else {
        return NextResponse.redirect(new URL("/profile", request.url));
      }
    } catch (e) {
      // If parsing fails, just let them go to login
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/employees/:path*", "/organization/:path*", "/profile/:path*", "/login"],
};
