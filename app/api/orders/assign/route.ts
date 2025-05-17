import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to assign an order to a driver and update its status to "in_transit"
 * POST /api/orders/assign
 * Body: { order_id: number, driver_id: number }
 */
export async function POST(request: Request) {
  try {
    console.log("POST request received at /api/orders/assign");
    const body = await request.json();
    console.log("Request body:", body);
    const { order_id, driver_id } = body;

    if (!order_id || !driver_id) {
      return NextResponse.json(
        { error: "Order ID and Driver ID are required" },
        { status: 400 }
      );
    }

    // First, check if the order is still in pending status and not assigned to any driver
    const checkResult = await sql`
      SELECT * FROM orders 
      WHERE id = ${order_id} 
      AND status = 'pending' 
      AND driver_id IS NULL
    `;

    if (!checkResult || checkResult.length === 0) {
      return NextResponse.json(
        { error: "Order not found, already assigned, or not in pending status" },
        { status: 404 }
      );
    }

    // Update the order: assign to driver and change status to in_transit
    const result = await sql`
      UPDATE orders
      SET 
        status = 'in_transit',
        driver_id = ${driver_id},
        updated_at = NOW()
      WHERE 
        id = ${order_id}
        AND status = 'pending'
        AND driver_id IS NULL
      RETURNING *
    `;

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "Failed to assign order to driver" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order assigned successfully and status updated to in_transit",
      order: result[0]
    });
  } catch (error) {
    console.error("Error assigning order to driver:", error);
    return NextResponse.json(
      { error: "Failed to assign order to driver" },
      { status: 500 }
    );
  }
}
