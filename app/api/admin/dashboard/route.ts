import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch admin dashboard metrics
 * GET /api/admin/dashboard?timeframe=today
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const timeframe = url.searchParams.get("timeframe") || "today";

    // Define date range based on timeframe
    let dateCondition;
    switch (timeframe) {
      case "today":
        dateCondition = sql`DATE(created_at) = CURRENT_DATE`;
        break;
      case "week":
        dateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '7 days')`;
        break;
      case "month":
        dateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '30 days')`;
        break;
      case "year":
        dateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '365 days')`;
        break;
      default:
        dateCondition = sql`DATE(created_at) = CURRENT_DATE`;
    }

    // Get total orders and revenue
    let ordersResult;
    try {
      ordersResult = await sql`
        SELECT
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue
        FROM
          orders
        WHERE
          ${dateCondition}
      `;
    } catch (error) {
      console.error("Error fetching orders data:", error);
      ordersResult = [{ total_orders: 0, total_revenue: 0 }];
    }

    // Get active drivers (drivers with role = 'driver')
    let driversResult;
    try {
      driversResult = await sql`
        SELECT
          COUNT(*) as active_drivers
        FROM
          users
        WHERE
          role = 'driver'
      `;
    } catch (error) {
      console.error("Error fetching drivers data:", error);
      driversResult = [{ active_drivers: 0 }];
    }

    // Get new users in the timeframe
    let newUsersResult;
    try {
      newUsersResult = await sql`
        SELECT
          COUNT(*) as new_users
        FROM
          users
        WHERE
          ${dateCondition}
      `;
    } catch (error) {
      console.error("Error fetching new users data:", error);
      newUsersResult = [{ new_users: 0 }];
    }

    // Get pending orders
    let pendingOrdersResult;
    try {
      pendingOrdersResult = await sql`
        SELECT
          COUNT(*) as pending_orders
        FROM
          orders
        WHERE
          status = 'pending'
      `;
    } catch (error) {
      console.error("Error fetching pending orders data:", error);
      pendingOrdersResult = [{ pending_orders: 0 }];
    }

    // Calculate growth compared to previous period
    let previousDateCondition;
    switch (timeframe) {
      case "today":
        previousDateCondition = sql`DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'`;
        break;
      case "week":
        previousDateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '14 days') AND DATE(created_at) < DATE(NOW() - INTERVAL '7 days')`;
        break;
      case "month":
        previousDateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '60 days') AND DATE(created_at) < DATE(NOW() - INTERVAL '30 days')`;
        break;
      case "year":
        previousDateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '730 days') AND DATE(created_at) < DATE(NOW() - INTERVAL '365 days')`;
        break;
      default:
        previousDateCondition = sql`DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'`;
    }

    // Get previous period data
    let previousOrdersResult;
    try {
      previousOrdersResult = await sql`
        SELECT
          COUNT(*) as total_orders,
          COALESCE(SUM(total_amount), 0) as total_revenue
        FROM
          orders
        WHERE
          ${previousDateCondition}
      `;
    } catch (error) {
      console.error("Error fetching previous period data:", error);
      previousOrdersResult = [{ total_orders: 0, total_revenue: 0 }];
    }

    // Calculate growth percentages
    const currentOrders = parseInt(ordersResult[0]?.total_orders) || 0;
    const previousOrders = parseInt(previousOrdersResult[0]?.total_orders) || 0;
    const ordersGrowth = previousOrders > 0
      ? ((currentOrders - previousOrders) / previousOrders) * 100
      : 0;

    const currentRevenue = parseFloat(ordersResult[0]?.total_revenue) || 0;
    const previousRevenue = parseFloat(previousOrdersResult[0]?.total_revenue) || 0;
    const revenueGrowth = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    // Compile metrics
    const metrics = {
      totalOrders: currentOrders,
      totalRevenue: currentRevenue,
      activeDrivers: parseInt(driversResult[0]?.active_drivers) || 0,
      activeVendors: 0, // Not tracking vendors in current schema
      newUsers: parseInt(newUsersResult[0]?.new_users) || 0,
      pendingOrders: parseInt(pendingOrdersResult[0]?.pending_orders) || 0,
      avgDeliveryTime: 0, // Not tracking delivery time in current schema
      issueRate: 0, // Not tracking issues in current schema
      growth: {
        orders: parseFloat(ordersGrowth.toFixed(1)),
        revenue: parseFloat(revenueGrowth.toFixed(1))
      }
    };

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error("Error fetching admin dashboard metrics:", error);

    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    // Skip table existence check as it's causing connection issues
    console.log("Skipping table existence check due to potential connection issues");

    // If there's an error, return mock data as fallback
    const mockMetrics = {
      totalOrders: 1248,
      totalRevenue: 28456.78,
      activeDrivers: 87,
      activeVendors: 0,
      newUsers: 56,
      pendingOrders: 32,
      avgDeliveryTime: 0,
      issueRate: 0,
      growth: {
        orders: 12.3,
        revenue: 8.2
      }
    };

    return NextResponse.json({
      metrics: mockMetrics,
      error: "Failed to fetch real metrics, showing mock data",
      errorDetails: error instanceof Error ? error.message : String(error)
    });
  }
}
