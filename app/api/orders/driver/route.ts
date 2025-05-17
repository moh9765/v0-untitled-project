import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch orders for a specific driver
 * GET /api/orders/driver?driver_id=123
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const driver_id = url.searchParams.get("driver_id");

    if (!driver_id) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    // Query to fetch active orders assigned to this driver (excluding delivered and cancelled)
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
        o.driver_id = ${driver_id}
        AND o.status NOT IN ('delivered', 'cancelled')
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
    console.error("Error fetching driver orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch driver orders" },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to update an order's status
 * POST /api/orders/driver
 * Body: { order_id: number, status: string }
 */
export async function POST(request: Request) {
  try {
    console.log("POST request received at /api/orders/driver");
    const body = await request.json();
    console.log("Request body:", body);
    const { order_id, status, driver_id } = body;

    if (!order_id || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: pending, in_transit, delivered, cancelled" },
        { status: 400 }
      );
    }

    // Update the order status
    const result = await sql`
      UPDATE orders
      SET
        status = ${status.toLowerCase()}
      WHERE
        id = ${order_id}
        ${driver_id ? sql`AND driver_id = ${driver_id}` : sql``}
      RETURNING *
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Order not found or you don't have permission to update it" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: result[0]
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
