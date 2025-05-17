import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Get orders table schema
    const ordersSchema = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'orders'
      ORDER BY ordinal_position
    `;

    // Get users table schema
    const usersSchema = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;

    // Get sample data from orders table
    const ordersSample = await sql`
      SELECT * FROM orders LIMIT 1
    `;

    // Get sample data from users table
    const usersSample = await sql`
      SELECT * FROM users LIMIT 1
    `;

    // Get list of all tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    return NextResponse.json({
      tables,
      orders: {
        schema: ordersSchema,
        sample: ordersSample
      },
      users: {
        schema: usersSchema,
        sample: usersSample
      }
    });
  } catch (error) {
    console.error("Error fetching schema:", error);
    return NextResponse.json(
      { error: "Failed to fetch schema" },
      { status: 500 }
    );
  }
}
