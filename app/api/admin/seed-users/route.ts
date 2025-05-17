import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to seed sample users for testing
 * POST /api/admin/seed-users
 */
export async function POST() {
  try {
    // Get existing users count
    const usersCountResult = await sql`SELECT COUNT(*) as count FROM users`;
    const existingUsersCount = parseInt(usersCountResult[0]?.count) || 0;
    
    if (existingUsersCount > 0) {
      return NextResponse.json({
        success: false,
        message: `There are already ${existingUsersCount} users in the database. This endpoint is for initial seeding only.`
      }, { status: 400 });
    }
    
    // Create sample users
    const roles = ["customer", "driver", "admin"];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];
    
    const createdUsers = [];
    
    // Create 10 sample users
    for (let i = 0; i < 10; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const name = `User ${i + 1}`;
      const email = `user${i + 1}@example.com`;
      const passwordHash = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"; // "password"
      
      // Insert user
      const userResult = await sql`
        INSERT INTO users (
          name, 
          email, 
          password_hash, 
          salt,
          role
        )
        VALUES (
          ${name}, 
          ${email}, 
          ${passwordHash}, 
          '', 
          ${role}
        )
        RETURNING id
      `;
      
      createdUsers.push(userResult[0].id);
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdUsers.length} sample users`,
      userIds: createdUsers
    });
  } catch (error) {
    console.error("Error seeding users:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
