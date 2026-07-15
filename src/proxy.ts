import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const url = req.nextUrl.clone()
  let hostname = req.headers.get('host') || ''
  let shouldRedirect = false

  // 1. Redirect www to non-www
  if (hostname.startsWith('www.')) {
    hostname = hostname.replace('www.', '')
    shouldRedirect = true
  }

  // 2. Redirect HTTP to HTTPS
  const protocol = req.headers.get('x-forwarded-proto') || url.protocol.replace(':', '')
  if (protocol === 'http' && process.env.NODE_ENV === 'production') {
    url.protocol = 'https:'
    shouldRedirect = true
  }

  // 3. Remove trailing slash
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1)
    shouldRedirect = true
  }

  if (shouldRedirect) {
    const canonicalUrl = `https://${hostname}${url.pathname}${url.search}`
    return NextResponse.redirect(canonicalUrl, 301)
  }

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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|media|.*\\.svg$).*)"],
}
