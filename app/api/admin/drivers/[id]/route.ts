import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * API endpoint to delete a driver
 * DELETE /api/admin/drivers/:id
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const driverId = params.id;

    if (!driverId) {
      return NextResponse.json(
        { error: "Driver ID is required" },
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

    // Check if driver has active orders
    const hasActiveOrders = await sql`
      SELECT EXISTS (
        SELECT 1 FROM orders
        WHERE driver_id::text = ${driverId}
        AND status NOT IN ('delivered', 'cancelled')
      )
    `;

    if (hasActiveOrders[0]?.exists) {
      return NextResponse.json(
        { error: "Cannot delete driver with active orders" },
        { status: 400 }
      );
    }

    // Delete driver profile if exists
    const profilesTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'driver_profiles'
      )
    `;

    if (profilesTableExists[0]?.exists) {
      await sql`
        DELETE FROM driver_profiles WHERE user_id::text = ${driverId}
      `;
    }

    // Delete driver (user record)
    await sql`
      DELETE FROM users WHERE id::text = ${driverId} AND role = 'driver'
    `;

    return NextResponse.json({
      success: true,
      message: "Driver deleted successfully",
      driverId
    });
  } catch (error) {
    console.error("Error deleting driver:", error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
