import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Проверка за токен
  const url = req.nextUrl;

  // Ако потребителят е на началната страница и има токен, го пренасочваме
  if (url.pathname === "/" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Защитени маршрути
  const protectedRoutes = ["/dashboard", "/assistant", "/forum", "/account"];

  if (protectedRoutes.some((route) => url.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Конфигурация на middleware
export const config = {
  matcher: ["/", "/dashboard/:path*", "/profile/:path*", "/forum/:path*", "/assistant/:path*"],
};
