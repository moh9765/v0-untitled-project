import { NextResponse } from "next/server"
import { acceptBroadcastedOrder } from "@/lib/db/order-broadcast"

/**
 * API endpoint for a driver to accept a broadcasted order
 * POST /api/orders/broadcast/accept
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

    // Accept the order
    await acceptBroadcastedOrder(order_id, driver_id)

    return NextResponse.json({
      success: true,
      message: "Order accepted successfully"
    })
  } catch (error) {
    console.error("Error accepting order:", error)
    return NextResponse.json(
      { error: "Failed to accept order" },
      { status: 500 }
    )
  }
}
