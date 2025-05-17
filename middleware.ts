import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname
  
  // Check if the path is for authentication pages
  const isAuthPage = path.startsWith('/auth/')
  
  // Get the session cookie
  const session = request.cookies.get('session')?.value
  
  // Allow all API routes to pass through without redirection
  if (path.startsWith('/api/')) {
    return NextResponse.next()
  }
  
  // Allow all Next.js internal routes
  if (path.startsWith('/_next/')) {
    return NextResponse.next()
  }
  
  // Allow access to public assets
  if (path.startsWith('/favicon.ico') || path.startsWith('/images/') || path.startsWith('/logo.webp')) {
    return NextResponse.next()
  }
  
  // Allow access to the home page even without a session
  if (path === '/') {
    return NextResponse.next()
  }
  
  // If there's a session and the user is trying to access an auth page,
  // redirect to the home page
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // For all other routes, let the client-side authentication handle redirects
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
