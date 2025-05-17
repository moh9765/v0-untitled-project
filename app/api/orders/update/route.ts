import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to update an order's status
 * POST /api/orders/update
 * Body: { order_id: number, status: string, driver_id?: number }
 */
export async function POST(request: Request) {
  try {
    console.log("POST request received at /api/orders/update");
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
    const validStatuses = ['pending', 'picked_up', 'in_transit', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
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
