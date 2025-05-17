import { NextResponse } from "next/server"
import { rejectBroadcastedOrder } from "@/lib/db/order-broadcast"

/**
 * API endpoint for a driver to reject a broadcasted order
 * POST /api/orders/broadcast/reject
 */
export async function POST(req: Request) {
  try {
    const { order_id, driver_id } = await req.json()

    if (!order_id || !driver_id) {
      return NextResponse.json(
        { error: "Order ID and Driver ID are required" },
        { status: 400 }
      )
    }

    // Reject the order
    await rejectBroadcastedOrder(order_id, driver_id)

    return NextResponse.json({
      success: true,
      message: "Order rejected successfully"
    })
  } catch (error) {
    console.error("Error rejecting order:", error)
    return NextResponse.json(
      { error: "Failed to reject order" },
      { status: 500 }
    )
  }
}
