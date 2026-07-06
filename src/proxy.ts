import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard')
  
  if ((isAdminRoute || isDashboardRoute) && !req.nextUrl.pathname.startsWith('/admin/login')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
    }
  }
  
  if (isAdminRoute && !req.nextUrl.pathname.startsWith('/admin/login')) {
    if (req.auth?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.nextUrl))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
