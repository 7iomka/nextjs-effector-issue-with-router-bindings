import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Setting cookies on the response
  const response = NextResponse.next()
  const pth = request.nextUrl.pathname

  console.log('Middleware works', pth)

  return response
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static generated files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static (static files in public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|static|shapes).*)',
  ],
}
