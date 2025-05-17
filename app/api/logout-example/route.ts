import { NextRequest, NextResponse } from "next/server";
import { deleteCookie } from "cookies-next";
import { cookies } from "next/headers";

/**
 * Example API endpoint showing how to use cookies-next with Next.js App Router
 * This demonstrates proper cookie clearing for logout functionality
 */
export async function GET(req: NextRequest) {
  // Get the cookies instance from next/headers
  const cookieStore = cookies();
  
  // List of common auth-related cookies to clear
  const cookiesToClear = [
    // Session cookies
    "session", "sessionid", "user_session", 
    
    // Authentication tokens
    "token", "auth_token", "access_token", "refresh_token", 
    
    // Stack-specific cookies
    "stack_token", "stack_refresh_token", "stack_session", 
    
    // Next.js specific cookies
    "next-auth.session-token", "next-auth.csrf-token",
    
    // User identifiers
    "user_id", "userId",
    
    // Application-specific cookies
    "is_authenticated"
  ];
  
  // Define paths to clear cookies for
  const paths = ["/", "/api", "/auth", "/app"];
  
  // Clear all cookies with server-side cookies API
  cookiesToClear.forEach(name => {
    // First try with root path
    cookieStore.delete(name);
    
    // Then with all other paths
    paths.forEach(path => {
      if (path !== "/") {
        cookieStore.delete(name, { path });
      }
    });
  });
  
  return NextResponse.json({
    success: true,
    message: "Logged out successfully using cookies-next",
    timestamp: new Date().toISOString()
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

/**
 * Example of how to use cookies-next in a client component
 * 
 * ```tsx
 * import { deleteCookie } from 'cookies-next';
 * 
 * // In your logout function
 * function handleLogout() {
 *   // Clear specific cookies
 *   deleteCookie('token');
 *   deleteCookie('session');
 *   deleteCookie('user_id');
 *   
 *   // Clear with specific paths
 *   deleteCookie('auth_token', { path: '/' });
 *   deleteCookie('auth_token', { path: '/api' });
 *   
 *   // Redirect to login
 *   router.push('/auth/login');
 * }
 * ```
 */
