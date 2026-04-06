import { type NextRequest, NextResponse } from 'next/server'

const PROTECTED = ['/booking', '/bookings', '/profile']
const AUTH_ONLY = ['/auth/login', '/auth/signup']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('handyman_session')

  if (PROTECTED.some((p) => pathname.startsWith(p)) && !session) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (AUTH_ONLY.some((p) => pathname.startsWith(p)) && session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
