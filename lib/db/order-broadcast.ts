import { sql } from "@/lib/db"
import { tableExists } from "@/lib/db-init"

/**
 * Initialize the order broadcast tables
 */
export async function initOrderBroadcastTables() {
  try {
    // Check if order_broadcasts table exists
    const broadcastsTableExists = await tableExists("order_broadcasts")
    
    if (!broadcastsTableExists) {
      // Create the table if it doesn't exist
      await sql`
        CREATE TABLE order_broadcasts (
          id SERIAL PRIMARY KEY,
          order_id INTEGER NOT NULL,
          driver_id INTEGER NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(order_id, driver_id)
        )
      `
      console.log("Created order_broadcasts table")
    } else {
      console.log("order_broadcasts table already exists")
    }

    // Add 'broadcasted' status to orders table if not already there
    // This is a safe operation that checks if the enum type already includes 'broadcasted'
    try {
      await sql`
        ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'broadcasted' AFTER 'pending'
      `
      console.log("Added 'broadcasted' status to order_status enum")
    } catch (error) {
      // If the enum type doesn't exist, the orders table might be using a VARCHAR for status
      console.log("Could not add to enum, status field might be VARCHAR")
    }

    return true
  } catch (error) {
    console.error("Error initializing order broadcast tables:", error)
    return false
  }
}

/**
 * Get all broadcasted orders for a driver
 */
export async function getDriverBroadcastedOrders(driverId: number | string) {
  try {
    const result = await sql`
      SELECT o.*, ob.status as broadcast_status
      FROM orders o
      JOIN order_broadcasts ob ON o.id = ob.order_id
      WHERE ob.driver_id = ${driverId}
      AND ob.status = 'pending'
      AND o.driver_id IS NULL
      AND o.status = 'broadcasted'
      ORDER BY o.created_at DESC
    `
    return result
  } catch (error) {
    console.error("Error fetching broadcasted orders:", error)
    throw error
  }
}

/**
 * Accept a broadcasted order
 */
export async function acceptBroadcastedOrder(orderId: number | string, driverId: number | string) {
  try {
    // Start a transaction
    await sql`BEGIN`

    // Update the order_broadcasts table
    await sql`
      UPDATE order_broadcasts
      SET status = 'accepted', updated_at = NOW()
      WHERE order_id = ${orderId} AND driver_id = ${driverId}
    `

    // Update the orders table
    await sql`
      UPDATE orders
      SET driver_id = ${driverId}, status = 'in_transit', updated_at = NOW()
      WHERE id = ${orderId} AND driver_id IS NULL
    `

    // Mark all other broadcasts for this order as 'rejected'
    await sql`
      UPDATE order_broadcasts
      SET status = 'rejected', updated_at = NOW()
      WHERE order_id = ${orderId} AND driver_id != ${driverId} AND status = 'pending'
    `

    // Commit the transaction
    await sql`COMMIT`

    return true
  } catch (error) {
    // Rollback the transaction on error
    await sql`ROLLBACK`
    console.error("Error accepting broadcasted order:", error)
    throw error
  }
}

/**
 * Reject a broadcasted order
 */
export async function rejectBroadcastedOrder(orderId: number | string, driverId: number | string) {
  try {
    await sql`
      UPDATE order_broadcasts
      SET status = 'rejected', updated_at = NOW()
      WHERE order_id = ${orderId} AND driver_id = ${driverId}
    `
    return true
  } catch (error) {
    console.error("Error rejecting broadcasted order:", error)
    throw error
  }
}
