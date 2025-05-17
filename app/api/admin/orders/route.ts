import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch orders for admin dashboard
 * GET /api/admin/orders?status=all&page=1&limit=10
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "all";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Check if order_items table exists
    const orderItemsTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'order_items'
      )
    `;
    
    const hasOrderItems = orderItemsTableExists[0]?.exists || false;
    
    // Base query to get orders with customer information
    let orders;
    let countResult;
    
    if (status !== "all") {
      // Query with status filter
      orders = await sql`
        SELECT
          o.id,
          o.customer_id,
          o.status,
          o.total_amount,
          o.created_at,
          o.updated_at,
          u.name as customer_name,
          u.email as customer_email
        FROM
          orders o
        LEFT JOIN
          users u ON o.customer_id = u.id
        WHERE
          o.status = ${status}
        ORDER BY
          o.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      // Count query with status filter
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM orders
        WHERE status = ${status}
      `;
    } else {
      // Query without status filter
      orders = await sql`
        SELECT
          o.id,
          o.customer_id,
          o.status,
          o.total_amount,
          o.created_at,
          o.updated_at,
          u.name as customer_name,
          u.email as customer_email
        FROM
          orders o
        LEFT JOIN
          users u ON o.customer_id = u.id
        ORDER BY
          o.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      
      // Count query without status filter
      countResult = await sql`
        SELECT COUNT(*) as total
        FROM orders
      `;
    }
    
    const total = parseInt(countResult[0]?.total) || 0;
    
    // Get order items if the table exists
    let ordersWithItems = orders;
    
    if (hasOrderItems) {
      // For each order, get its items
      ordersWithItems = await Promise.all(orders.map(async (order: any) => {
        const items = await sql`
          SELECT * FROM order_items WHERE order_id = ${order.id}
        `;
        return { ...order, items };
      }));
    }

    // Format the results
    const formattedOrders = ordersWithItems.map((order: any) => {
      // Default payment method and other fields that might not be in the database
      const paymentMethod = order.payment_method || "credit_card";
      const paymentStatus = order.payment_status || "paid";
      
      return {
        id: order.id.toString(),
        customerId: order.customer_id?.toString(),
        customerName: order.customer_name || "Unknown Customer",
        status: order.status || "pending",
        date: order.created_at,
        total: parseFloat(order.total_amount) || 0,
        items: (order.items || []).map((item: any) => ({
          id: item.id.toString(),
          name: item.product_name || `Product ${item.id}`,
          quantity: item.quantity || 1,
          price: parseFloat(item.price) || 0
        })),
        paymentMethod,
        paymentStatus,
        vendorId: order.restaurant_id?.toString() || "unknown",
        vendorName: "Local Restaurant", // Placeholder since we don't have vendor data
        city: "Local Area", // Placeholder since we don't have location data
        deliveryAddress: order.delivery_address || "No address provided",
        pickupAddress: order.pickup_address || "Restaurant address",
        deliveryFee: 0, // Placeholder
        notes: order.notes || ""
      };
    });

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching admin orders:", error);
    
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    // If there's an error, return empty data
    return NextResponse.json({
      orders: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      },
      error: "Failed to fetch orders",
      errorDetails: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
