import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard')
  
  // Enforce login for all admin/dashboard routes
  if ((isAdminRoute || isDashboardRoute) && !req.nextUrl.pathname.startsWith('/admin/login')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
    }
  }
  
  // Restrict authors from super-admin only routes
  const superAdminRoutes = ['/admin/categories', '/admin/users', '/admin/settings']
  const isSuperAdminRoute = superAdminRoutes.some(route => req.nextUrl.pathname.startsWith(route))
  
  if (isSuperAdminRoute) {
    if (req.auth?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
