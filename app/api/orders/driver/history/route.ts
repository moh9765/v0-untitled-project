import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch completed orders (delivered or cancelled) for a specific driver
 * GET /api/orders/driver/history?driver_id=123
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const driver_id = url.searchParams.get("driver_id");

    console.log("Received driver_id:", driver_id);

    if (!driver_id) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    // Ensure driver_id is a valid number
    const driverId = parseInt(driver_id);
    if (isNaN(driverId)) {
      return NextResponse.json(
        { error: "Invalid driver ID format. Must be a number." },
        { status: 400 }
      );
    }

    // Query to fetch completed orders (delivered or cancelled) assigned to this driver
    const result = await sql`
      SELECT
        o.*,
        u.name as customer_name,
        u.email as customer_email,
        COALESCE(
          json_agg(
            json_build_object(
              'id', oi.id,
              'product_id', oi.product_id,
              'quantity', oi.quantity,
              'price', oi.price,
              'product_name', p.name,
              'product_name_ar', p.name_ar,
              'product_thumbnail', (
                SELECT url FROM product_images
                WHERE product_id = p.id AND is_thumbnail = true
                LIMIT 1
              )
            )
          ) FILTER (WHERE oi.id IS NOT NULL),
          '[]'::json
        ) as items
      FROM
        orders o
      LEFT JOIN
        users u ON o.customer_id = u.id
      LEFT JOIN
        order_items oi ON o.id = oi.order_id
      LEFT JOIN
        products p ON oi.product_id = p.id
      WHERE
        o.driver_id = ${driverId}
        AND o.status IN ('delivered', 'cancelled')
      GROUP BY
        o.id, u.id
      ORDER BY
        o.updated_at DESC
    `;

    // Check if the result has rows
    if (!result || result.length === 0) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    return NextResponse.json({ orders: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching driver history:", error);

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: "Failed to fetch driver history",
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
