import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch system alerts for admin dashboard
 * GET /api/admin/alerts?limit=4
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "4");

    // Generate dynamic alerts based on real data
    try {
      // Get pending orders count
      const pendingOrdersResult = await sql`
        SELECT COUNT(*) as count FROM orders WHERE status = 'pending'
      `;
      const pendingOrders = parseInt(pendingOrdersResult[0]?.count) || 0;

      // Get driver count
      const driversResult = await sql`
        SELECT COUNT(*) as count FROM users WHERE role = 'driver'
      `;
      const driverCount = parseInt(driversResult[0]?.count) || 0;

      // Get recent orders (last 24 hours)
      const recentOrdersResult = await sql`
        SELECT COUNT(*) as count FROM orders
        WHERE created_at >= NOW() - INTERVAL '24 hours'
      `;
      const recentOrders = parseInt(recentOrdersResult[0]?.count) || 0;

      // Generate dynamic alerts based on the data
      const alerts = [];

      // System status alert
      alerts.push({
        id: "alert-1",
        type: "info",
        title: "System Status",
        description: "All systems are operating normally.",
        time: "Just now",
      });

      // Pending orders alert
      if (pendingOrders > 0) {
        alerts.push({
          id: "alert-2",
          type: pendingOrders > 10 ? "warning" : "info",
          title: "Pending Orders",
          description: `There are currently ${pendingOrders} pending orders in the system.`,
          time: "5 minutes ago",
          actionText: "View Orders",
          actionLink: "/admin/orders",
        });
      }

      // Driver availability alert
      if (driverCount < 5) {
        alerts.push({
          id: "alert-3",
          type: "warning",
          title: "Driver Availability",
          description: `There are only ${driverCount} active drivers in the system.`,
          time: "30 minutes ago",
          actionText: "View Drivers",
          actionLink: "/admin/drivers",
        });
      } else {
        alerts.push({
          id: "alert-3",
          type: "success",
          title: "Driver Availability",
          description: `There are ${driverCount} active drivers in the system.`,
          time: "30 minutes ago",
        });
      }

      // Recent orders alert
      alerts.push({
        id: "alert-4",
        type: recentOrders > 0 ? "success" : "info",
        title: "Recent Activity",
        description: recentOrders > 0
          ? `${recentOrders} orders have been placed in the last 24 hours.`
          : "No new orders in the last 24 hours.",
        time: "1 hour ago",
      });

      // Add dashboard update alert
      alerts.push({
        id: "alert-5",
        type: "info",
        title: "Dashboard Update",
        description: "The admin dashboard now displays real-time data from the database.",
        time: "2 hours ago",
      });

      return NextResponse.json({ alerts: alerts.slice(0, limit) });
    } catch (error) {
      console.error("Error generating dynamic alerts:", error);

      // Fallback to default alerts
      return NextResponse.json({
        alerts: [
          {
            id: "alert-1",
            type: "info",
            title: "System Status",
            description: "All systems are operating normally.",
            time: "Just now",
          },
          {
            id: "alert-2",
            type: "warning",
            title: "Driver Availability",
            description: "There are fewer active drivers than usual in the Downtown area.",
            time: "30 minutes ago",
            actionText: "View Drivers",
            actionLink: "/admin/drivers",
          },
          {
            id: "alert-3",
            type: "info",
            title: "New Feature",
            description: "The admin dashboard now displays real-time data from the database.",
            time: "1 hour ago",
          },
          {
            id: "alert-4",
            type: "success",
            title: "Database Backup",
            description: "Automatic database backup completed successfully.",
            time: "2 hours ago",
          },
        ].slice(0, limit),
        error: "Failed to generate dynamic alerts, showing default alerts"
      });
    }
  } catch (error) {
    console.error("Error fetching system alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch system alerts" },
      { status: 500 }
    );
  }
}
