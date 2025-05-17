import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch recent orders for admin dashboard
 * GET /api/admin/recent-orders?limit=5
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "5");

    // Query to fetch recent orders with customer information
    const result = await sql`
      SELECT
        o.id,
        o.status,
        o.created_at as date,
        o.total_amount as total,
        u.name as customer,
        (
          SELECT COUNT(*) FROM order_items WHERE order_id = o.id
        ) as items
      FROM
        orders o
      LEFT JOIN
        users u ON o.customer_id = u.id
      ORDER BY
        o.created_at DESC
      LIMIT ${limit}
    `;

    // Format the results and add placeholder data for vendor info
    const formattedOrders = result.map((order: any) => ({
      id: order.id.toString(),
      customer: order.customer || 'Unknown Customer',
      status: order.status || 'pending',
      date: order.date,
      total: parseFloat(order.total) || 0,
      items: parseInt(order.items) || 0,
      vendor: "Local Restaurant", // Placeholder since we don't have vendor data
      city: "Local Area" // Placeholder since we don't have location data
    }));

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching recent orders:", error);

    // Return mock data if query fails
    const mockOrders = [
      {
        id: "ORD-1234",
        customer: "John Doe",
        status: "pending",
        date: new Date(Date.now() - 30 * 60000).toISOString(),
        total: 45.99,
        items: 3,
        vendor: "Pizza Palace",
        city: "New York"
      },
      {
        id: "ORD-1235",
        customer: "Jane Smith",
        status: "in_transit",
        date: new Date(Date.now() - 45 * 60000).toISOString(),
        total: 32.50,
        items: 2,
        vendor: "Burger King",
        city: "Los Angeles"
      },
      {
        id: "ORD-1236",
        customer: "Robert Johnson",
        status: "delivered",
        date: new Date(Date.now() - 135 * 60000).toISOString(),
        total: 78.25,
        items: 5,
        vendor: "Sushi Express",
        city: "Chicago"
      },
      {
        id: "ORD-1237",
        customer: "Emily Davis",
        status: "cancelled",
        date: new Date(Date.now() - 180 * 60000).toISOString(),
        total: 25.99,
        items: 1,
        vendor: "Taco Bell",
        city: "Miami"
      },
      {
        id: "ORD-1238",
        customer: "Michael Wilson",
        status: "pending",
        date: new Date(Date.now() - 195 * 60000).toISOString(),
        total: 56.75,
        items: 4,
        vendor: "KFC",
        city: "Houston"
      }
    ].slice(0, limit);

    return NextResponse.json({
      orders: mockOrders,
      error: "Failed to fetch real orders, showing mock data"
    });
  }
}
