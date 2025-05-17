import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch revenue chart data for admin dashboard
 * GET /api/admin/revenue-chart?timeframe=today
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const timeframe = url.searchParams.get("timeframe") || "today";

    // Use simpler SQL queries that are more compatible with different database systems
    try {
      let result;

      switch (timeframe) {
        case "today":
          // Hourly data for today - simplified query
          result = await sql`
            SELECT
              EXTRACT(HOUR FROM created_at)::text || ':00' as name,
              COALESCE(SUM(total_amount), 0) as revenue,
              COUNT(*) as orders
            FROM
              orders
            WHERE
              DATE(created_at) = CURRENT_DATE
            GROUP BY
              EXTRACT(HOUR FROM created_at)
            ORDER BY
              EXTRACT(HOUR FROM created_at)
          `;
          break;

        case "week":
          // Daily data for this week - simplified query
          result = await sql`
            SELECT
              to_char(DATE(created_at), 'Dy') as name,
              COALESCE(SUM(total_amount), 0) as revenue,
              COUNT(*) as orders
            FROM
              orders
            WHERE
              created_at >= NOW() - INTERVAL '7 days'
            GROUP BY
              DATE(created_at), to_char(DATE(created_at), 'Dy')
            ORDER BY
              DATE(created_at)
          `;
          break;

        case "month":
          // Daily data for this month - simplified query
          result = await sql`
            SELECT
              to_char(DATE(created_at), 'DD') as name,
              COALESCE(SUM(total_amount), 0) as revenue,
              COUNT(*) as orders
            FROM
              orders
            WHERE
              created_at >= NOW() - INTERVAL '30 days'
            GROUP BY
              DATE(created_at), to_char(DATE(created_at), 'DD')
            ORDER BY
              DATE(created_at)
          `;
          break;

        case "year":
          // Monthly data for this year - simplified query
          result = await sql`
            SELECT
              to_char(DATE(created_at), 'Mon') as name,
              COALESCE(SUM(total_amount), 0) as revenue,
              COUNT(*) as orders
            FROM
              orders
            WHERE
              created_at >= NOW() - INTERVAL '365 days'
            GROUP BY
              to_char(DATE(created_at), 'Mon'), EXTRACT(MONTH FROM created_at)
            ORDER BY
              EXTRACT(MONTH FROM created_at)
          `;
          break;

        default:
          // Default to today with simplified query
          result = await sql`
            SELECT
              EXTRACT(HOUR FROM created_at)::text || ':00' as name,
              COALESCE(SUM(total_amount), 0) as revenue,
              COUNT(*) as orders
            FROM
              orders
            WHERE
              DATE(created_at) = CURRENT_DATE
            GROUP BY
              EXTRACT(HOUR FROM created_at)
            ORDER BY
              EXTRACT(HOUR FROM created_at)
          `;
      }

      // If no data returned, use mock data
      if (!result || result.length === 0) {
        return NextResponse.json({
          data: generateMockData(timeframe),
          message: "No data found for the selected timeframe, showing mock data"
        });
      }

      // Format the data to ensure all values are numbers
      const formattedData = result.map((item: any) => ({
        name: item.name,
        revenue: parseFloat(item.revenue) || 0,
        orders: parseInt(item.orders) || 0
      }));

      return NextResponse.json({ data: formattedData });
    } catch (error) {
      console.error("Error executing revenue chart query:", error);

      // Return mock data if query fails
      return NextResponse.json({
        data: generateMockData(timeframe),
        error: "Failed to fetch real data, showing mock data"
      });
    }
  } catch (error) {
    console.error("Error fetching revenue chart data:", error);

    // Return mock data if query fails
    return NextResponse.json({
      data: generateMockData(timeframe),
      error: "Failed to fetch real data, showing mock data"
    });
  }
}

// Helper function to generate mock data based on timeframe
function generateMockData(timeframe: string) {
  let chartData = [];

  if (timeframe === "today") {
    // Hourly data for today
    chartData = Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, "0") + ":00";
      return {
        name: hour,
        revenue: Math.floor(Math.random() * 2000) + 500,
        orders: Math.floor(Math.random() * 20) + 5,
      };
    });
  } else if (timeframe === "week") {
    // Daily data for this week
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    chartData = days.map(day => ({
      name: day,
      revenue: Math.floor(Math.random() * 10000) + 2000,
      orders: Math.floor(Math.random() * 100) + 20,
    }));
  } else if (timeframe === "month") {
    // Generate data for each day of the month (simplified to 30 days)
    chartData = Array.from({ length: 30 }, (_, i) => ({
      name: `Day ${i + 1}`,
      revenue: Math.floor(Math.random() * 15000) + 3000,
      orders: Math.floor(Math.random() * 150) + 30,
    }));
  } else if (timeframe === "year") {
    // Monthly data for this year
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    chartData = months.map(month => ({
      name: month,
      revenue: Math.floor(Math.random() * 100000) + 20000,
      orders: Math.floor(Math.random() * 1000) + 200,
    }));
  }

  return chartData;
}
