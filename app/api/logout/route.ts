import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { invalidateUserSession } from "@/lib/db/users";

/**
 * API endpoint to handle server-side logout
 * - Invalidates the user session in the database
 * - Clears all authentication cookies with various paths and domains
 * - Returns appropriate headers for cache control
 * - Works in both normal and private browsing modes
 */
export async function POST(request: NextRequest) {
  // Log the request for debugging
  console.log("Logout API called with URL:", request.url);

  // Get the session ID from cookies to invalidate in the database
  const sessionId = request.cookies.get("session")?.value;

  // Invalidate the session in the database if we have a session ID
  if (sessionId) {
    try {
      await invalidateUserSession(sessionId);
      console.log(`Session invalidated in database for ID: ${sessionId}`);
    } catch (error) {
      console.error("Error invalidating session in database:", error);
      // Continue with cookie clearing even if database operation fails
    }
  } else {
    console.log("No session cookie found to invalidate");
  }

  // Create a response object with strong cache control headers
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
    timestamp: new Date().toISOString() // Add timestamp to prevent caching
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': 'Thu, 01 Jan 1970 00:00:00 GMT',
      'Surrogate-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Vary': '*'
    }
  });

  // Common cookie clearing options
  const clearOptions = {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0), // Set expiration to the past
    sameSite: "lax" as const, // Use "lax" instead of "strict" for better compatibility
  };

  // Comprehensive list of cookies to clear
  const cookiesToClear = [
    // Session cookies
    "session",
    "sessionid",
    "user_session",
    "JSESSIONID", // Java-based session ID
    "PHPSESSID", // PHP session ID
    "connect.sid", // Express session ID

    // Authentication tokens
    "token",
    "auth_token",
    "access_token",
    "refresh_token",
    "id_token",
    "jwt",
    "bearer",
    "authorization",

    // Third-party auth tokens
    "stack-token",
    "oauth_token",
    "google_token",
    "facebook_token",
    "github_token",
    "twitter_token",

    // User identifiers
    "user_id",
    "userId",
    "uid",
    "user",
    "username",
    "email",

    // Remember me and persistent login
    "remember_me",
    "stay_logged_in",
    "keep_signed_in",
    "remember",

    // CSRF tokens that might be tied to the session
    "csrf_token",
    "xsrf_token",
    "csrf",
    "xsrf",

    // Application-specific cookies
    "app_session",
    "app_auth",
    "app_user",
    "app_token",
    "app_data",

    // Stack-specific cookies (used by @stackframe/stack)
    "stack_token",
    "stack_refresh_token",
    "stack_session",
    "stack_auth",
    "stack_user",
    "stack.token",
    "stack.refresh",
    "stack.session",
    "stack.auth",
    "next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",

    // Next.js specific cookies
    "__next",
    "next-locale",
    "next-auth.csrf-token",
    "next-auth.callback-url",
    "next-auth.session-token",

    // Any other potential auth-related cookies
    "login_redirect",
    "auth_state",
    "auth_nonce",
    "auth_verifier",
    "logged_in",
    "is_authenticated",
  ];

  // Get all cookies from the request to ensure we don't miss any
  const allCookies = request.cookies.getAll();
  const allCookieNames = allCookies.map(cookie => cookie.name);

  // Log all cookies for debugging
  console.log("All cookies found:", allCookieNames);

  // Define all paths to clear cookies for
  const paths = ["/", "/api", "/auth", "/app", "/customer", "/driver", "/profile", "/dashboard"];

  // Clear all cookies in our predefined list with all paths
  cookiesToClear.forEach(cookieName => {
    // Clear with root path first
    response.cookies.set(cookieName, "", clearOptions);

    // Then clear with all other paths
    paths.forEach(path => {
      if (path !== "/") { // Skip root path as we already did it
        const pathOptions = { ...clearOptions, path };
        response.cookies.set(cookieName, "", pathOptions);
      }
    });

    // Also try clearing with domain options (for cross-subdomain cookies)
    try {
      const domain = new URL(request.url).hostname;
      if (domain !== "localhost") {
        // Try with and without leading dot for wildcard subdomains
        const domainOptions = {
          ...clearOptions,
          domain
        };
        response.cookies.set(cookieName, "", domainOptions);

        // If domain has multiple parts, try with leading dot for wildcard
        if (domain.split('.').length > 1) {
          const wildcardDomainOptions = {
            ...clearOptions,
            domain: `.${domain}`
          };
          response.cookies.set(cookieName, "", wildcardDomainOptions);
        }
      }
    } catch (e) {
      console.warn("Error clearing cookie with domain options:", e);
    }
  });

  // Also clear any cookie that contains auth-related keywords
  const authKeywords = [
    "auth", "token", "session", "login", "user", "jwt", "oauth",
    "account", "credential", "secure", "verify", "validated"
  ];

  allCookieNames.forEach(cookieName => {
    // If the cookie name contains any auth keyword and isn't already in our list
    if (!cookiesToClear.includes(cookieName) &&
        authKeywords.some(keyword => cookieName.toLowerCase().includes(keyword))) {
      console.log(`Clearing additional auth-related cookie: ${cookieName}`);

      // Clear with all paths
      paths.forEach(path => {
        const pathOptions = { ...clearOptions, path };
        response.cookies.set(cookieName, "", pathOptions);
      });
    }
  });

  // As a final step, clear ALL cookies found in the request
  // This ensures we don't miss anything, even if it's not in our predefined lists
  allCookieNames.forEach(cookieName => {
    // Clear with root path
    response.cookies.set(cookieName, "", clearOptions);

    // And with all other paths
    paths.forEach(path => {
      if (path !== "/") {
        const pathOptions = { ...clearOptions, path };
        response.cookies.set(cookieName, "", pathOptions);
      }
    });
  });

  // Log successful logout
  console.log("User logged out successfully - all cookies cleared");

  return response;
}
