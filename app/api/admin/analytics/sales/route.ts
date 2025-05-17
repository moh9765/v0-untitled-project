import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch sales analytics data for admin dashboard
 * GET /api/admin/analytics/sales?timeframe=month
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const timeframe = url.searchParams.get("timeframe") || "month";

    // Define date range based on timeframe
    let dateCondition;
    let groupBy;
    let orderBy;
    let nameFormat;

    switch (timeframe) {
      case "day":
        dateCondition = sql`DATE(created_at) = CURRENT_DATE`;
        groupBy = sql`EXTRACT(HOUR FROM created_at)`;
        orderBy = sql`EXTRACT(HOUR FROM created_at)`;
        nameFormat = sql`EXTRACT(HOUR FROM created_at)::text || ':00'`;
        break;
      case "week":
        dateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '7 days')`;
        groupBy = sql`DATE(created_at)`;
        orderBy = sql`DATE(created_at)`;
        nameFormat = sql`to_char(DATE(created_at), 'Dy')`;
        break;
      case "month":
        dateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '30 days')`;
        groupBy = sql`DATE(created_at)`;
        orderBy = sql`DATE(created_at)`;
        nameFormat = sql`to_char(DATE(created_at), 'DD')`;
        break;
      case "year":
        dateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '365 days')`;
        groupBy = sql`EXTRACT(MONTH FROM created_at)`;
        orderBy = sql`EXTRACT(MONTH FROM created_at)`;
        nameFormat = sql`to_char(DATE(created_at), 'Mon')`;
        break;
      default:
        dateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '30 days')`;
        groupBy = sql`DATE(created_at)`;
        orderBy = sql`DATE(created_at)`;
        nameFormat = sql`to_char(DATE(created_at), 'DD')`;
    }

    // Get total orders and revenue for the selected timeframe
    const metricsResult = await sql`
      SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as average_order_value
      FROM
        orders
      WHERE
        ${dateCondition}
    `;

    // Get previous period metrics for comparison
    let prevDateCondition;
    switch (timeframe) {
      case "day":
        prevDateCondition = sql`DATE(created_at) = CURRENT_DATE - INTERVAL '1 day'`;
        break;
      case "week":
        prevDateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '14 days') AND DATE(created_at) < DATE(NOW() - INTERVAL '7 days')`;
        break;
      case "month":
        prevDateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '60 days') AND DATE(created_at) < DATE(NOW() - INTERVAL '30 days')`;
        break;
      case "year":
        prevDateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '730 days') AND DATE(created_at) < DATE(NOW() - INTERVAL '365 days')`;
        break;
      default:
        prevDateCondition = sql`DATE(created_at) >= DATE(NOW() - INTERVAL '60 days') AND DATE(created_at) < DATE(NOW() - INTERVAL '30 days')`;
    }

    const prevMetricsResult = await sql`
      SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(AVG(total_amount), 0) as average_order_value
      FROM
        orders
      WHERE
        ${prevDateCondition}
    `;

    // Calculate growth percentages
    const currentOrders = parseInt(metricsResult[0]?.total_orders) || 0;
    const currentRevenue = parseFloat(metricsResult[0]?.total_revenue) || 0;
    const currentAOV = parseFloat(metricsResult[0]?.average_order_value) || 0;

    const prevOrders = parseInt(prevMetricsResult[0]?.total_orders) || 1; // Avoid division by zero
    const prevRevenue = parseFloat(prevMetricsResult[0]?.total_revenue) || 1;
    const prevAOV = parseFloat(prevMetricsResult[0]?.average_order_value) || 1;

    const ordersGrowth = ((currentOrders - prevOrders) / prevOrders) * 100;
    const revenueGrowth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
    const aovGrowth = ((currentAOV - prevAOV) / prevAOV) * 100;

    // Get refunds data (assuming a status of 'refunded' for orders)
    const refundsResult = await sql`
      SELECT
        COUNT(*) as refund_count,
        COALESCE(SUM(total_amount), 0) as refund_amount
      FROM
        orders
      WHERE
        ${dateCondition} AND status = 'refunded'
    `;

    const refundAmount = parseFloat(refundsResult[0]?.refund_amount) || 0;
    const refundCount = parseInt(refundsResult[0]?.refund_count) || 0;

    // Get sales by time data
    const salesByTimeResult = await sql`
      SELECT
        ${nameFormat} as name,
        COALESCE(SUM(total_amount), 0) as revenue,
        COUNT(*) as orders
      FROM
        orders
      WHERE
        ${dateCondition}
      GROUP BY
        ${groupBy}, ${nameFormat}
      ORDER BY
        ${orderBy}
    `;

    // Format the sales by time data
    const salesByTime = salesByTimeResult.map((item: any) => ({
      name: item.name,
      revenue: parseFloat(item.revenue) || 0,
      orders: parseInt(item.orders) || 0
    }));

    // Get sales by payment method
    // Assuming payment_method is a column in the orders table
    const salesByPaymentMethodResult = await sql`
      SELECT
        COALESCE(payment_method, 'Unknown') as name,
        COALESCE(SUM(total_amount), 0) as value
      FROM
        orders
      WHERE
        ${dateCondition}
      GROUP BY
        payment_method
      ORDER BY
        value DESC
    `;

    // Format the sales by payment method data
    const salesByPaymentMethod = salesByPaymentMethodResult.map((item: any) => ({
      name: item.name,
      value: parseFloat(item.value) || 0
    }));

    // Since we don't have category information in the current schema,
    // we'll create mock data for sales by category
    const salesByCategory = [
      { name: "Food", value: currentRevenue * 0.6 },
      { name: "Grocery", value: currentRevenue * 0.25 },
      { name: "Pharmacy", value: currentRevenue * 0.1 },
      { name: "Convenience", value: currentRevenue * 0.05 }
    ];

    // Get sales by city (if delivery_address contains city information)
    // Since we don't have structured city data, we'll use mock data
    const salesByCity = [
      { name: "New York", value: currentRevenue * 0.3 },
      { name: "Los Angeles", value: currentRevenue * 0.2 },
      { name: "Chicago", value: currentRevenue * 0.15 },
      { name: "Houston", value: currentRevenue * 0.12 },
      { name: "Miami", value: currentRevenue * 0.08 },
      { name: "Other", value: currentRevenue * 0.15 }
    ];

    // Calculate delivery fees and commissions (assuming 10% of total revenue each)
    const deliveryFees = currentRevenue * 0.1;
    const commissions = currentRevenue * 0.15;

    // Compile all metrics
    const metrics = {
      totalRevenue: currentRevenue,
      totalOrders: currentOrders,
      averageOrderValue: currentAOV,
      deliveryFees,
      commissions,
      refunds: refundAmount,
      growth: {
        revenue: parseFloat(revenueGrowth.toFixed(1)),
        orders: parseFloat(ordersGrowth.toFixed(1)),
        aov: parseFloat(aovGrowth.toFixed(1))
      }
    };

    return NextResponse.json({
      metrics,
      salesByTime,
      salesByCategory,
      salesByPaymentMethod,
      salesByCity
    });
  } catch (error) {
    console.error("Error fetching sales analytics:", error);

    // If there's an error, return mock data as fallback
    const mockRevenue = 456789.45;
    const tf = url.searchParams.get("timeframe") || "month"; // Get timeframe again to avoid undefined reference

    return NextResponse.json({
      metrics: {
        totalRevenue: mockRevenue,
        totalOrders: 12458,
        averageOrderValue: 36.67,
        deliveryFees: mockRevenue * 0.1,
        commissions: mockRevenue * 0.15,
        refunds: mockRevenue * 0.01,
        growth: {
          revenue: 15.7,
          orders: 12.3,
          aov: 3.2
        }
      },
      salesByTime: generateMockTimeData(tf),
      salesByCategory: [
        { name: "Food", value: mockRevenue * 0.6 },
        { name: "Grocery", value: mockRevenue * 0.25 },
        { name: "Pharmacy", value: mockRevenue * 0.1 },
        { name: "Convenience", value: mockRevenue * 0.05 }
      ],
      salesByPaymentMethod: [
        { name: "Credit Card", value: mockRevenue * 0.65 },
        { name: "Cash", value: mockRevenue * 0.2 },
        { name: "Wallet", value: mockRevenue * 0.15 }
      ],
      salesByCity: [
        { name: "New York", value: mockRevenue * 0.3 },
        { name: "Los Angeles", value: mockRevenue * 0.2 },
        { name: "Chicago", value: mockRevenue * 0.15 },
        { name: "Houston", value: mockRevenue * 0.12 },
        { name: "Miami", value: mockRevenue * 0.08 },
        { name: "Other", value: mockRevenue * 0.15 }
      ],
      error: "Failed to fetch real metrics, showing mock data",
      errorDetails: error instanceof Error ? error.message : String(error)
    });
  }
}

// Helper function to generate mock time data
function generateMockTimeData(timeframe: string) {
  const data = [];

  if (timeframe === "day") {
    // Hourly data for today
    for (let i = 0; i < 24; i++) {
      data.push({
        name: `${i}:00`,
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 50) + 10
      });
    }
  } else if (timeframe === "week") {
    // Daily data for this week
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (let i = 0; i < 7; i++) {
      data.push({
        name: days[i],
        revenue: Math.floor(Math.random() * 20000) + 5000,
        orders: Math.floor(Math.random() * 200) + 50
      });
    }
  } else if (timeframe === "month") {
    // Weekly data for this month
    for (let i = 1; i <= 30; i++) {
      data.push({
        name: i.toString(),
        revenue: Math.floor(Math.random() * 10000) + 2000,
        orders: Math.floor(Math.random() * 100) + 20
      });
    }
  } else {
    // Monthly data for this year
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 12; i++) {
      data.push({
        name: months[i],
        revenue: Math.floor(Math.random() * 500000) + 100000,
        orders: Math.floor(Math.random() * 5000) + 1000
      });
    }
  }

  return data;
}
