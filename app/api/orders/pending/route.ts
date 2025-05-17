import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch all orders with "pending" status
 * GET /api/orders/pending
 */
export async function GET() {
  try {
    // Query to fetch all orders with "pending" status
    const result = await sql`
      SELECT
        o.*,
        u.name as customer_name,
        u.email as customer_email,
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
        ) FILTER (WHERE oi.id IS NOT NULL) as items
      FROM
        orders o
      LEFT JOIN
        users u ON o.customer_id = u.id
      LEFT JOIN
        order_items oi ON o.id = oi.order_id
      LEFT JOIN
        products p ON oi.product_id = p.id
      WHERE
        o.status = 'pending'
        AND o.driver_id IS NULL
      GROUP BY
        o.id, u.id
      ORDER BY
        o.created_at DESC
    `;

    // Check if the result has rows
    if (!result || result.length === 0) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    return NextResponse.json({ orders: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pending orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending orders" },
      { status: 500 }
    );
  }
}
