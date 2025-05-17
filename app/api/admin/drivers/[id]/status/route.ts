import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { upsertDriverProfile } from "@/lib/db/driver-profiles";

/**
 * API endpoint to update a driver's status
 * PUT /api/admin/drivers/:id/status
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const driverId = params.id;
    const { status } = await request.json();

    if (!driverId) {
      return NextResponse.json(
        { error: "Driver ID is required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["online", "offline", "on_delivery", "suspended"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    // Check if driver exists
    const driverExists = await sql`
      SELECT EXISTS (
        SELECT 1 FROM users WHERE id::text = ${driverId} AND role = 'driver'
      )
    `;

    if (!driverExists[0]?.exists) {
      return NextResponse.json(
        { error: "Driver not found" },
        { status: 404 }
      );
    }

    // Check if driver_profiles table exists
    const profilesTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'driver_profiles'
      )
    `;

    if (profilesTableExists[0]?.exists) {
      // Update driver profile
      await upsertDriverProfile(driverId, {
        status,
        last_active: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      message: `Driver status updated to ${status}`,
      driverId,
      status
    });
  } catch (error) {
    console.error("Error updating driver status:", error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
