import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { addFundsToWallet } from "@/lib/db/wallet";

/**
 * API endpoint to get driver earnings
 * GET /api/driver/earnings?driver_id=123
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const driver_id = url.searchParams.get("driver_id");

    if (!driver_id) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    // Get earnings summary
    const result = await sql`
      SELECT
        COUNT(*) as total_deliveries,
        SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 ELSE 0 END) as today_deliveries,
        SUM(CASE WHEN DATE(created_at) >= DATE(NOW() - INTERVAL '7 days') THEN 1 ELSE 0 END) as week_deliveries,
        SUM(total_amount * 0.15) as total_earnings,
        SUM(CASE WHEN DATE(created_at) = CURRENT_DATE THEN total_amount * 0.15 ELSE 0 END) as today_earnings,
        SUM(CASE WHEN DATE(created_at) >= DATE(NOW() - INTERVAL '7 days') THEN total_amount * 0.15 ELSE 0 END) as week_earnings
      FROM
        orders
      WHERE
        driver_id = ${driver_id}
        AND status = 'delivered'
    `;

    // Get recent deliveries
    const recentDeliveries = await sql`
      SELECT
        id,
        total_amount,
        status,
        created_at,
        updated_at,
        (total_amount * 0.15) as earnings
      FROM
        orders
      WHERE
        driver_id = ${driver_id}
        AND status = 'delivered'
      ORDER BY
        created_at DESC
      LIMIT 10
    `;

    return NextResponse.json({
      earnings: result[0] || {
        total_deliveries: 0,
        today_deliveries: 0,
        week_deliveries: 0,
        total_earnings: 0,
        today_earnings: 0,
        week_earnings: 0
      },
      recent_deliveries: recentDeliveries || []
    });
  } catch (error) {
    console.error("Error fetching driver earnings:", error);
    return NextResponse.json(
      { error: "Failed to fetch driver earnings" },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to add earnings to driver wallet
 * POST /api/driver/earnings
 */
export async function POST(request: Request) {
  try {
    const { driver_id, order_id, amount } = await request.json();

    if (!driver_id || !order_id || !amount) {
      return NextResponse.json(
        { error: "Driver ID, order ID, and amount are required" },
        { status: 400 }
      );
    }

    // Add funds to driver's wallet
    const result = await addFundsToWallet(
      driver_id,
      amount,
      `Earnings from order #${order_id}`,
      order_id
    );

    return NextResponse.json({
      success: true,
      message: "Earnings added to wallet",
      ...result
    });
  } catch (error) {
    console.error("Error adding driver earnings:", error);
    return NextResponse.json(
      { error: "Failed to add driver earnings" },
      { status: 500 }
    );
  }
}
