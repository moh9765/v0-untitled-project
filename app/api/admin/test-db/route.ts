import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to test database connectivity
 * GET /api/admin/test-db
 */
export async function GET() {
  try {
    // Test basic connectivity
    const result = await sql`SELECT 1 as test`;
    
    // Check if tables exist
    const usersTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'users'
      )
    `;
    
    const ordersTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'orders'
      )
    `;
    
    // Try to count records in tables if they exist
    let usersCount = null;
    let ordersCount = null;
    
    if (usersTableExists[0]?.exists) {
      const usersResult = await sql`SELECT COUNT(*) as count FROM users`;
      usersCount = parseInt(usersResult[0]?.count) || 0;
    }
    
    if (ordersTableExists[0]?.exists) {
      const ordersResult = await sql`SELECT COUNT(*) as count FROM orders`;
      ordersCount = parseInt(ordersResult[0]?.count) || 0;
    }
    
    return NextResponse.json({
      success: true,
      connection: "OK",
      test: result[0]?.test,
      tables: {
        users: {
          exists: usersTableExists[0]?.exists || false,
          count: usersCount
        },
        orders: {
          exists: ordersTableExists[0]?.exists || false,
          count: ordersCount
        }
      }
    });
  } catch (error) {
    console.error("Database connection test error:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
