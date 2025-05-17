import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to check database schema
 * GET /api/admin/check-schema
 */
export async function GET() {
  try {
    // Check users table columns
    const usersColumns = await sql`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;
    
    // Check orders table columns
    const ordersColumns = await sql`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'orders'
      ORDER BY ordinal_position
    `;
    
    // Check driver_profiles table columns if it exists
    const profilesTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'driver_profiles'
      )
    `;
    
    let driverProfilesColumns = [];
    if (profilesTableExists[0]?.exists) {
      driverProfilesColumns = await sql`
        SELECT column_name, data_type, udt_name
        FROM information_schema.columns
        WHERE table_name = 'driver_profiles'
        ORDER BY ordinal_position
      `;
    }
    
    return NextResponse.json({
      success: true,
      schema: {
        users: usersColumns,
        orders: ordersColumns,
        driver_profiles: driverProfilesColumns
      }
    });
  } catch (error) {
    console.error("Error checking database schema:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
