import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to fetch drivers for admin dashboard
 * GET /api/admin/drivers?status=all&page=1&limit=10
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "all";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Count total drivers from database
    let total = 0;
    try {
      const countResult = await sql`
        SELECT COUNT(*) as total
        FROM users
        WHERE role = 'driver'
      `;
      total = parseInt(countResult[0]?.total) || 0;
    } catch (countError) {
      console.error("Error counting drivers:", countError);
      // Default to 10 if we can't get the count
      total = 10;
    }

    // Generate mock data for now to avoid database type issues
    const statuses = ["online", "offline", "on_delivery", "suspended"];
    const vehicleTypes = ["car", "motorcycle", "bicycle", "scooter"];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];

    // Create mock drivers
    const mockDrivers = Array.from({ length: Math.min(limit, 10) }, (_, i) => {
      const driverId = i + 1;
      const driverStatus = status !== "all" ? status : statuses[Math.floor(Math.random() * statuses.length)];
      const hasActiveOrder = driverStatus === "on_delivery";

      return {
        id: driverId.toString(),
        name: `Driver ${driverId}`,
        email: `driver${driverId}@example.com`,
        phone: `+1 (555) ${100 + driverId}-${1000 + driverId}`,
        status: driverStatus,
        rating: Math.floor(Math.random() * 50) / 10 + 3,
        totalDeliveries: Math.floor(Math.random() * 1000),
        acceptanceRate: Math.floor(Math.random() * 30) + 70,
        city: cities[Math.floor(Math.random() * cities.length)],
        currentLocation: driverStatus !== "offline" ? {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.006 + (Math.random() - 0.5) * 0.1,
          address: `${1000 + Math.floor(Math.random() * 9000)} Main St, ${cities[Math.floor(Math.random() * cities.length)]}`
        } : undefined,
        vehicle: {
          type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
          model: `Vehicle Model ${Math.floor(Math.random() * 10) + 1}`,
          licensePlate: `ABC-${1000 + Math.floor(Math.random() * 9000)}`
        },
        earnings: {
          today: Math.floor(Math.random() * 10000) / 100,
          week: Math.floor(Math.random() * 50000) / 100,
          month: Math.floor(Math.random() * 200000) / 100,
          total: Math.floor(Math.random() * 1000000) / 100
        },
        activeOrder: hasActiveOrder ? {
          id: `ORD-${10000 + Math.floor(Math.random() * 1000)}`,
          status: "in_transit",
          estimatedDeliveryTime: new Date(Date.now() + Math.floor(Math.random() * 60) * 60 * 1000).toISOString()
        } : undefined,
        joinDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString()
      };
    });

    // Return the mock drivers
    return NextResponse.json({
      drivers: mockDrivers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching admin drivers:", error);

    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }

    // If there's an error, return empty data
    return NextResponse.json({
      drivers: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      },
      error: "Failed to fetch drivers",
      errorDetails: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
