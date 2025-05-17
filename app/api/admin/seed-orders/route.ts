import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to seed sample orders for testing
 * POST /api/admin/seed-orders
 */
export async function POST() {
  try {
    // First, check if we have any users
    const usersResult = await sql`SELECT id FROM users LIMIT 10`;
    
    if (!usersResult || usersResult.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No users found. Please create users first."
      }, { status: 400 });
    }
    
    // Get existing orders count
    const ordersCountResult = await sql`SELECT COUNT(*) as count FROM orders`;
    const existingOrdersCount = parseInt(ordersCountResult[0]?.count) || 0;
    
    if (existingOrdersCount > 0) {
      return NextResponse.json({
        success: false,
        message: `There are already ${existingOrdersCount} orders in the database. This endpoint is for initial seeding only.`
      }, { status: 400 });
    }
    
    // Create sample orders
    const statuses = ["pending", "accepted", "preparing", "ready", "picked_up", "in_transit", "delivered", "cancelled"];
    const paymentMethods = ["credit_card", "cash", "wallet"];
    const paymentStatuses = ["paid", "pending", "failed", "refunded"];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];
    const productNames = ["Burger", "Pizza", "Salad", "Pasta", "Sushi", "Sandwich", "Taco", "Ice Cream"];
    
    const createdOrders = [];
    
    // Create 20 sample orders
    for (let i = 0; i < 20; i++) {
      const customerId = usersResult[Math.floor(Math.random() * usersResult.length)].id;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      
      // Create random date within the last 30 days
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));
      
      // Insert order
      const orderResult = await sql`
        INSERT INTO orders (
          customer_id, 
          status, 
          total_amount, 
          created_at,
          payment_method,
          payment_status,
          delivery_address,
          pickup_address,
          notes
        )
        VALUES (
          ${customerId}, 
          ${status}, 
          0, 
          ${createdAt.toISOString()},
          ${paymentMethod},
          ${paymentStatus},
          ${`${1000 + Math.floor(Math.random() * 9000)} Main St, ${city}`},
          ${`${100 + Math.floor(Math.random() * 900)} Restaurant St, ${city}`},
          ${Math.random() > 0.7 ? "Please deliver to the back door." : null}
        )
        RETURNING id
      `;
      
      const orderId = orderResult[0].id;
      
      // Create 1-5 order items
      const itemCount = Math.floor(Math.random() * 5) + 1;
      let totalAmount = 0;
      
      for (let j = 0; j < itemCount; j++) {
        const productName = productNames[Math.floor(Math.random() * productNames.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const price = Math.floor(Math.random() * 1000) / 100 + 5; // $5.00 - $15.00
        const itemTotal = quantity * price;
        totalAmount += itemTotal;
        
        await sql`
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            price
          )
          VALUES (
            ${orderId},
            ${`prod-${Math.floor(Math.random() * 1000)}`},
            ${productName},
            ${quantity},
            ${price}
          )
        `;
      }
      
      // Update order total
      await sql`
        UPDATE orders 
        SET total_amount = ${totalAmount}
        WHERE id = ${orderId}
      `;
      
      createdOrders.push(orderId);
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdOrders.length} sample orders`,
      orderIds: createdOrders
    });
  } catch (error) {
    console.error("Error seeding orders:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
