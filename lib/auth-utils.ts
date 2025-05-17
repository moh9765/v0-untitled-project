// This file contains client-side authentication utilities
// Server-side crypto functions have been moved to server-auth-utils.ts

/**
 * Comprehensive logout function that clears all authentication data
 * @param redirectPath - Path to redirect to after logout (default: "/auth/login")
 * @returns Promise that resolves when logout is complete
 */
export async function logout(redirectPath: string = "/auth/login"): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Starting comprehensive logout process...");

      // 1. Add a logout parameter to the redirect URL
      // This is more reliable than sessionStorage for private browsing
      const redirectUrl = new URL(redirectPath, window.location.origin);
      redirectUrl.searchParams.set("logged_out", "true");

      // Also try to use sessionStorage as a fallback for non-private browsing
      try {
        sessionStorage.setItem("just_logged_out", "true");
      } catch (e) {
        console.warn("Could not set logout flag in sessionStorage, possibly in private browsing mode:", e);
      }

      // 2. Clear all client-side storage
      // This ensures that even if the API call fails, the client-side state is cleared
      try {
        console.log("Clearing localStorage...");
        // First, try to clear individual items to handle potential quota errors
        const authItems = [
          // Basic auth items
          "is_authenticated", "user_email", "user_role", "user_id",
          "token", "refresh_token", "access_token", "session_id", "session_data",

          // Stack-related items
          "stack_token", "stack_refresh_token", "stack_user", "stack_session",
          "stack.token", "stack.refresh", "stack.user", "stack.session",

          // Any other auth-related items
          "auth_token", "id_token", "jwt_token", "bearer_token"
        ];

        // Try to remove each item individually first
        authItems.forEach(item => {
          try {
            localStorage.removeItem(item);
          } catch (e) {
            console.warn(`Error removing ${item} from localStorage:`, e);
          }
        });

        // Then try to clear everything
        try {
          localStorage.clear();
        } catch (e) {
          console.warn("Error clearing localStorage completely:", e);
        }
      } catch (e) {
        console.error("Error accessing localStorage:", e);
      }

      // 3. Clear sessionStorage
      try {
        console.log("Clearing sessionStorage...");
        // First try to clear individual items
        const sessionItems = ["user_data", "auth_state", "cart_data"];
        sessionItems.forEach(item => {
          try {
            sessionStorage.removeItem(item);
          } catch (e) {
            console.warn(`Error removing ${item} from sessionStorage:`, e);
          }
        });

        // Then try to clear everything except our logout flag
        try {
          const logoutFlag = sessionStorage.getItem("just_logged_out");
          sessionStorage.clear();
          if (logoutFlag) {
            sessionStorage.setItem("just_logged_out", logoutFlag);
          }
        } catch (e) {
          console.warn("Error clearing sessionStorage completely:", e);
        }
      } catch (e) {
        console.error("Error accessing sessionStorage:", e);
      }

      // 4. Clear client-side cookies that might not be httpOnly
      console.log("Clearing client-accessible cookies...");

      // 4.1 First try using cookies-next library if available
      try {
        // Dynamic import to avoid issues if the library isn't installed
        import('cookies-next').then(({ deleteCookie }) => {
          console.log("Using cookies-next library to clear cookies");

          // List of common auth-related cookies to clear
          const cookiesToClear = [
            // Session cookies
            "session", "sessionid", "user_session", "JSESSIONID", "PHPSESSID", "connect.sid",

            // Authentication tokens
            "token", "auth_token", "access_token", "refresh_token", "id_token", "jwt", "bearer",

            // Stack-specific cookies
            "stack_token", "stack_refresh_token", "stack_session", "stack_auth", "stack_user",
            "stack.token", "stack.refresh", "stack.session", "stack.auth",

            // Next.js specific cookies
            "__next", "next-locale", "next-auth.csrf-token", "next-auth.callback-url", "next-auth.session-token",

            // User identifiers
            "user_id", "userId", "uid", "user", "username", "email",

            // Application-specific cookies
            "is_authenticated", "logged_in", "auth_state"
          ];

          // Define all paths to clear cookies for
          const paths = ["/", "/api", "/auth", "/app", "/customer", "/driver", "/profile", "/dashboard"];

          // Clear each cookie with each path
          cookiesToClear.forEach(name => {
            paths.forEach(path => {
              try {
                deleteCookie(name, { path });
              } catch (e) {
                console.warn(`Error clearing cookie ${name} with path ${path} using cookies-next:`, e);
              }
            });
          });

          // Also try to clear all cookies found in document.cookie
          try {
            const cookies = document.cookie.split(";");
            cookies.forEach(cookie => {
              const eqPos = cookie.indexOf("=");
              const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
              if (!name) return;

              paths.forEach(path => {
                try {
                  deleteCookie(name, { path });
                } catch (e) {
                  console.warn(`Error clearing cookie ${name} with path ${path} using cookies-next:`, e);
                }
              });
            });
          } catch (e) {
            console.warn("Error processing cookies with cookies-next:", e);
          }
        }).catch(e => {
          console.warn("cookies-next library not available, falling back to manual cookie clearing:", e);
        });
      } catch (e) {
        console.warn("Error importing cookies-next, falling back to manual cookie clearing:", e);
      }

      // 4.2 Also use the traditional method as a fallback
      try {
        const cookies = document.cookie.split(";");

        for (let i = 0; i < cookies.length; i++) {
          try {
            const cookie = cookies[i];
            if (!cookie) continue;

            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
            if (!name) continue;

            // Set expiration to the past for each cookie with various paths
            const paths = ["/", "/api", "/auth", "/app", "/customer", "/driver", "/profile", "/dashboard"];
            paths.forEach(path => {
              try {
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};secure`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};secure;SameSite=Strict`;
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};secure;SameSite=Lax`;
              } catch (e) {
                console.warn(`Error clearing cookie ${name} with path ${path}:`, e);
              }
            });
          } catch (e) {
            console.warn("Error processing cookie:", e);
          }
        }
      } catch (e) {
        console.error("Error accessing cookies:", e);
      }

      // 5. Clear session cookie by making a request to the logout API
      console.log("Calling server-side logout API...");
      let apiSuccess = false;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout (increased for reliability)

        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/logout?_=${timestamp}`, {
          method: "POST",
          credentials: "include", // Important for cookies
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          apiSuccess = true;
          console.log("Server-side logout successful");
        } else {
          console.error("Logout API returned error status:", response.status);
        }
      } catch (error) {
        console.error("Error calling logout API:", error);
        // Continue with client-side logout even if API call fails
      }

      // 6. Final verification step - double check localStorage and sessionStorage
      try {
        // Check localStorage again
        const authItems = [
          // Basic auth items
          "is_authenticated", "user_email", "user_role", "user_id",
          "token", "refresh_token", "access_token", "session_id", "session_data",

          // Stack-related items
          "stack_token", "stack_refresh_token", "stack_user", "stack_session",
          "stack.token", "stack.refresh", "stack.user", "stack.session",

          // Any other auth-related items
          "auth_token", "id_token", "jwt_token", "bearer_token"
        ];

        authItems.forEach(item => {
          try {
            if (localStorage.getItem(item)) {
              console.warn(`Found remaining item in localStorage: ${item}, removing it...`);
              localStorage.removeItem(item);
            }
          } catch (e) {
            console.warn(`Error checking/removing ${item} from localStorage:`, e);
          }
        });
      } catch (e) {
        console.error("Error during final localStorage verification:", e);
      }

      // 7. Redirect with a full page refresh to ensure clean state
      console.log(`Logout complete, redirecting to ${redirectUrl.toString()}...`);

      // Use a small delay to ensure all async operations have completed
      setTimeout(() => {
        // Use window.location.replace instead of href to prevent back button issues
        window.location.replace(redirectUrl.toString());
        resolve(); // Resolve the promise to indicate completion
      }, apiSuccess ? 500 : 800); // Wait longer if the API call failed

    } catch (error) {
      console.error("Unexpected error during logout:", error);

      // Even if there's an error, try to redirect to login with the logged_out parameter
      try {
        const fallbackUrl = new URL(redirectPath, window.location.origin);
        fallbackUrl.searchParams.set("logged_out", "true");
        window.location.replace(fallbackUrl.toString());
      } catch (e) {
        // Last resort fallback
        window.location.replace("/auth/login?logged_out=true");
      }

      reject(error); // Reject the promise to indicate failure
    }
  });
}
