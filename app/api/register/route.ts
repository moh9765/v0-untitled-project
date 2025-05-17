import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { tableExists } from "@/lib/db-init";

// Function to hash password
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Initialize users table if it doesn't exist
async function initUsersTable() {
  try {
    const exists = await tableExists("users");
    if (!exists) {
      await sql`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password_hash TEXT NOT NULL,
          salt TEXT,
          role TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `;
      console.log("Created users table");
    }
    return true;
  } catch (error) {
    console.error("Error initializing users table:", error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    // Initialize users table
    await initUsersTable();

    // Get user data from request
    const { name, email, password, role } = await req.json();

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password, and role are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Insert new user
    const result = await sql`
      INSERT INTO users (name, email, password_hash, salt, role)
      VALUES (${name}, ${email}, ${password_hash}, '', ${role})
      RETURNING id, name, email, role
    `;

    // Return success response
    return NextResponse.json({
      success: true,
      user: result[0]
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
