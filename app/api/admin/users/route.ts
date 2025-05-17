import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch users for admin dashboard
 * GET /api/admin/users?role=all&page=1&limit=10
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const role = url.searchParams.get("role") || "all";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Execute the query with parameterized queries for better security
    let users;
    let countResult;

    if (role !== "all") {
      // Query with role filter
      users = await sql`
        SELECT
          u.id,
          u.name,
          u.email,
          u.role,
          u.created_at as registration_date,
          COALESCE(
            (SELECT COUNT(*) FROM orders WHERE customer_id = u.id),
            0
          ) as total_orders
        FROM
          users u
        WHERE
          u.role = ${role}
        ORDER BY
          u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      // Count query with role filter
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM users
        WHERE role = ${role}
      `;
    } else {
      // Query without role filter
      users = await sql`
        SELECT
          u.id,
          u.name,
          u.email,
          u.role,
          u.created_at as registration_date,
          COALESCE(
            (SELECT COUNT(*) FROM orders WHERE customer_id = u.id),
            0
          ) as total_orders
        FROM
          users u
        ORDER BY
          u.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      // Count query without role filter
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM users
      `;
    }
    const total = parseInt(countResult[0]?.total) || 0;

    // Format the results
    const formattedUsers = users.map((user: any) => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: "active", // Default status since we don't have this in the DB yet
      registrationDate: user.registration_date,
      city: "Unknown", // We don't have city in the DB yet
      totalOrders: parseInt(user.total_orders) || 0
    }));

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching admin users:", error);

    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    // If there's an error, return empty data
    return NextResponse.json({
      users: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      },
      error: "Failed to fetch users",
      errorDetails: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
