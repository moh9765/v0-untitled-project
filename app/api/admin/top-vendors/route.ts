import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch top performing vendors for admin dashboard
 * GET /api/admin/top-vendors?limit=5
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "5");

    // Since we don't have a vendors table, we'll use the restaurant_id from orders
    // to group orders by restaurant and calculate metrics
    try {
      // Check if restaurant_id column exists in orders table
      const restaurantIdExists = await sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'orders' AND column_name = 'restaurant_id'
      `;

      if (restaurantIdExists && restaurantIdExists.length > 0) {
        // If restaurant_id exists, use it to group orders
        const result = await sql`
          SELECT
            o.restaurant_id as id,
            'Restaurant ' || o.restaurant_id as name,
            COUNT(o.id) as orders,
            SUM(o.total_amount) as revenue
          FROM
            orders o
          WHERE
            o.created_at >= NOW() - INTERVAL '30 days'
            AND o.restaurant_id IS NOT NULL
          GROUP BY
            o.restaurant_id
          ORDER BY
            revenue DESC
          LIMIT ${limit}
        `;

        // Format the results
        const formattedVendors = result.map((vendor: any) => ({
          name: vendor.name,
          orders: parseInt(vendor.orders) || 0,
          revenue: parseFloat(vendor.revenue) || 0
        }));

        return NextResponse.json({ vendors: formattedVendors });
      } else {
        // If restaurant_id doesn't exist, group by customer_id as a proxy
        // This is just to show real data patterns even if it's not actual vendor data
        const result = await sql`
          SELECT
            u.name,
            COUNT(o.id) as orders,
            SUM(o.total_amount) as revenue
          FROM
            orders o
          JOIN
            users u ON o.customer_id = u.id
          WHERE
            o.created_at >= NOW() - INTERVAL '30 days'
          GROUP BY
            u.id, u.name
          ORDER BY
            revenue DESC
          LIMIT ${limit}
        `;

        // Format the results
        const formattedVendors = result.map((vendor: any) => ({
          name: vendor.name + " (Customer)",
          orders: parseInt(vendor.orders) || 0,
          revenue: parseFloat(vendor.revenue) || 0
        }));

        return NextResponse.json({ vendors: formattedVendors });
      }
    } catch (error) {
      // If query fails, return mock data
      console.error("Error fetching top vendors, using mock data:", error);

      const mockVendors = [
        {
          name: "Pizza Palace",
          orders: 245,
          revenue: 12450,
        },
        {
          name: "Burger King",
          orders: 190,
          revenue: 9500,
        },
        {
          name: "Sushi Express",
          orders: 150,
          revenue: 11250,
        },
        {
          name: "Taco Bell",
          orders: 120,
          revenue: 6000,
        },
        {
          name: "KFC",
          orders: 110,
          revenue: 5500,
        },
      ].slice(0, limit);

      return NextResponse.json({
        vendors: mockVendors,
        error: "Failed to fetch real vendor data, showing mock data"
      });
    }
  } catch (error) {
    console.error("Error fetching top vendors:", error);
    return NextResponse.json(
      { error: "Failed to fetch top vendors" },
      { status: 500 }
    );
  }
}
