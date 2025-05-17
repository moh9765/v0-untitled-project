import type { NextApiRequest, NextApiResponse, } from "next";
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { addRewardPoints } from "@/lib/db/rewards";
import { initOrderBroadcastTables } from "@/lib/db/order-broadcast";

// Initialize SQL client
const sql = neon('postgresql://neondb_owner:npg_ed7EglWtc6Bj@ep-silent-butterfly-a2xjsfvf-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require');

export async function POST(req: Request) {
  try {
    const { customer_id, driver_id = null, items, address } = await req.json()
    console.log("Received customer_id:", customer_id, items); // Log the received customer_id

    if (!customer_id || !Array.isArray(items)) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
    }

    // Validate address
    if (!address || !address.street_address || !address.city || !address.state || !address.zip_code) {
      return NextResponse.json({ error: "Valid delivery address is required" }, { status: 400 })
    }

    const userid = await sql`SELECT id FROM users WHERE email = ${customer_id}`

    // Check if orders table has delivery_address column
    const checkColumn = await sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'orders' AND column_name = 'delivery_address'
    `

    // Add delivery_address column if it doesn't exist
    if (checkColumn.length === 0) {
      await sql`
        ALTER TABLE orders
        ADD COLUMN delivery_address JSONB
      `
    }

    // Format address as JSON
    const deliveryAddress = {
      street_address: address.street_address,
      apartment: address.apartment || null,
      city: address.city,
      state: address.state,
      zip_code: address.zip_code,
      special_instructions: address.special_instructions || null
    }

    // Insert order with address
    const orderResult = await sql`
      INSERT INTO orders (customer_id, driver_id, status, total_amount, delivery_address)
      VALUES (${userid[0].id}, ${driver_id}, 'pending', 0, ${JSON.stringify(deliveryAddress)})
      RETURNING id
    `
    const orderId = orderResult[0].id

    // Insert items
    for (const item of items) {
      const { product_id, quantity } = item

      const product = await sql`SELECT price FROM products WHERE id = ${product_id}`
      const price = product[0]?.price
      if (!price) throw new Error(`Invalid product_id: ${product_id}`)

      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${orderId}, ${product_id}, ${quantity}, ${price})
      `
    }

    // Calculate total
    const total = await sql`
      SELECT SUM(quantity * price) AS total FROM order_items WHERE order_id = ${orderId}
    `
    const totalAmount = total[0]?.total || 0

    await sql`
      UPDATE orders SET total_amount = ${totalAmount} WHERE id = ${orderId}
    `

    // Award reward points (1 point per dollar spent, rounded to nearest integer)
    const pointsToAward = Math.round(Number(totalAmount));
    try {
      await addRewardPoints(
        userid[0].id,
        pointsToAward,
        `Order #${orderId} completed`,
        'earned',
        orderId.toString()
      );
    } catch (rewardError) {
      console.error("Error awarding points:", rewardError);
      // Continue with checkout even if points award fails
    }

    // Ensure order broadcast tables exist
    await initOrderBroadcastTables();

    // Broadcast the order to all available drivers
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/orders/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!response.ok) {
        console.error('Failed to broadcast order:', await response.text());
      } else {
        console.log('Order broadcasted successfully');
      }
    } catch (broadcastError) {
      console.error('Error broadcasting order:', broadcastError);
      // Continue with checkout even if broadcasting fails
    }

    return NextResponse.json({
      order_id: orderId,
      points_awarded: pointsToAward,
      broadcasted: true
    })
  } catch (error) {
    console.error("Checkout API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}