import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

/**
 * API endpoint to broadcast an order to all available drivers
 * POST /api/orders/broadcast
 */
export async function POST(req: Request) {
  try {
    const { order_id } = await req.json()

    if (!order_id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      )
    }

    // 1. Get the order details
    const orderResult = await sql`
      SELECT * FROM orders WHERE id = ${order_id}
    `

    if (!orderResult || orderResult.length === 0) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    const order = orderResult[0]

    // 2. Check if the order is already assigned to a driver
    if (order.driver_id) {
      return NextResponse.json(
        { error: "Order is already assigned to a driver" },
        { status: 400 }
      )
    }

    // 3. Update the order status to "Broadcasted"
    await sql`
      UPDATE orders 
      SET status = 'broadcasted', updated_at = NOW() 
      WHERE id = ${order_id}
    `

    // 4. Get all active drivers
    const driversResult = await sql`
      SELECT id, name, email 
      FROM users 
      WHERE role = 'driver' AND status = 'active'
    `

    if (!driversResult || driversResult.length === 0) {
      return NextResponse.json(
        { message: "No active drivers found, order marked as broadcasted" },
        { status: 200 }
      )
    }

    // 5. Create broadcast records for each driver
    for (const driver of driversResult) {
      await sql`
        INSERT INTO order_broadcasts (
          order_id, 
          driver_id, 
          status, 
          created_at, 
          updated_at
        )
        VALUES (
          ${order_id}, 
          ${driver.id}, 
          'pending', 
          NOW(), 
          NOW()
        )
        ON CONFLICT (order_id, driver_id) 
        DO UPDATE SET 
          status = 'pending',
          updated_at = NOW()
      `
    }

    return NextResponse.json({
      success: true,
      message: `Order broadcasted to ${driversResult.length} drivers`,
      drivers_count: driversResult.length
    })
  } catch (error) {
    console.error("Error broadcasting order:", error)
    return NextResponse.json(
      { error: "Failed to broadcast order" },
      { status: 500 }
    )
  }
}

/**
 * API endpoint to get all broadcasted orders for a driver
 * GET /api/orders/broadcast?driver_id=123
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const driver_id = url.searchParams.get("driver_id")

    if (!driver_id) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      )
    }

    // Get all broadcasted orders for this driver
    const result = await sql`
      SELECT o.*, ob.status as broadcast_status
      FROM orders o
      JOIN order_broadcasts ob ON o.id = ob.order_id
      WHERE ob.driver_id = ${driver_id}
      AND ob.status = 'pending'
      AND o.driver_id IS NULL
      AND o.status = 'broadcasted'
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({ orders: result })
  } catch (error) {
    console.error("Error fetching broadcasted orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch broadcasted orders" },
      { status: 500 }
    )
  }
}
