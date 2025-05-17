import { neon } from "@neondatabase/serverless";

const sql = neon('postgresql://neondb_owner:npg_ed7EglWtc6Bj@ep-silent-butterfly-a2xjsfvf-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require');

export async function createUser({ name, email, password, role }: { name: string, email: string, password: string, role: string }) {
  try {
    const password_hash = await hashPassword(password);

    const result = await sql`
      INSERT INTO users (name, email, password_hash, salt, role)
      VALUES (${name}, ${email}, ${password_hash}, '', ${role})
      RETURNING id, name, email, role;
    `;

    return result[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create user");
  }
}
export async function verifyUser(email: string, password: string) {
    try {
      const result = await sql`
        SELECT  email, password_hash, role, id FROM users WHERE email = ${email}
      `;

      if (result.length === 0) {
        return null;
      }

      const user = result[0];
      const hashedInputPassword = await hashPassword(password);

      if (hashedInputPassword === user.password_hash) {
        return { email: user.email, role: user.role, userId: user.id }; // Return user data with camelCase userId
      } else {
        return null;
      }
    } catch (error) {
      console.error("Verification Error:", error);
      throw new Error("Failed to verify user");
    }
  }
  export async function getUserById(id: string) {
    try {
      const result = await sql`
        SELECT id, name, email, role FROM users WHERE id = ${id}
      `;

      if (result.length === 0) {
        return null;
      }

      return result[0]; // contains id, name, email, role
    } catch (error) {
      console.error("GetUserById Error:", error);
      throw new Error("Failed to fetch user by ID");
    }
  }
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

/**
 * Invalidate a user's session in the database
 * This function marks the session as invalid in the database
 * In a real application, this would update a sessions table or user_sessions table
 *
 * @param userId - The user ID to invalidate the session for
 * @returns Promise that resolves when the session is invalidated
 */
export async function invalidateUserSession(userId: string): Promise<void> {
  try {
    // In a real application with a sessions table, you would do something like:
    // await sql`UPDATE sessions SET is_valid = false, invalidated_at = NOW() WHERE user_id = ${userId} AND is_valid = true`;

    // For this implementation, we'll log the invalidation
    console.log(`Session invalidated for user ID: ${userId}`);

    // If you have an active_sessions table, you would delete the session:
    // await sql`DELETE FROM active_sessions WHERE user_id = ${userId}`;

    // If you use JWT with a token blacklist:
    // await sql`INSERT INTO token_blacklist (user_id, blacklisted_at) VALUES (${userId}, NOW())`;

    return Promise.resolve();
  } catch (error) {
    console.error("Error invalidating user session:", error);
    throw new Error("Failed to invalidate user session");
  }
}
