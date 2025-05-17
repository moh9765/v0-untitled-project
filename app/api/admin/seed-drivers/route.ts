import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { upsertDriverProfile } from "@/lib/db/driver-profiles";

/**
 * API endpoint to seed driver profiles for testing
 * POST /api/admin/seed-drivers
 */
export async function POST() {
  try {
    // Check if driver_profiles table exists
    const profilesTableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'driver_profiles'
      )
    `;
    
    if (!profilesTableExists[0]?.exists) {
      return NextResponse.json({
        success: false,
        message: "Driver profiles table does not exist. Please initialize the database first."
      }, { status: 400 });
    }
    
    // Get all users with role='driver'
    const drivers = await sql`
      SELECT id, name, email FROM users WHERE role = 'driver'
    `;
    
    if (!drivers || drivers.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No drivers found. Please create driver users first."
      }, { status: 400 });
    }
    
    // Create sample data
    const statuses = ["online", "offline", "on_delivery", "suspended"];
    const vehicleTypes = ["car", "motorcycle", "bicycle", "scooter"];
    const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Miami"];
    
    const createdProfiles = [];
    
    // Create profiles for each driver
    for (const driver of drivers) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      
      // Create random location near New York City
      const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
      const lng = -74.006 + (Math.random() - 0.5) * 0.1;
      
      // Create profile
      const profile = await upsertDriverProfile(driver.id, {
        status,
        rating: Math.floor(Math.random() * 50) / 10 + 3,
        total_deliveries: Math.floor(Math.random() * 1000),
        acceptance_rate: Math.floor(Math.random() * 30) + 70,
        vehicle_type: vehicleType,
        vehicle_model: `Vehicle Model ${Math.floor(Math.random() * 10) + 1}`,
        license_plate: `ABC-${1000 + Math.floor(Math.random() * 9000)}`,
        current_lat: status !== "offline" ? lat : null,
        current_lng: status !== "offline" ? lng : null,
        current_address: status !== "offline" ? `${1000 + Math.floor(Math.random() * 9000)} Main St, ${city}` : null,
        city,
        last_active: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000)
      });
      
      createdProfiles.push(profile);
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdProfiles.length} driver profiles`,
      profiles: createdProfiles
    });
  } catch (error) {
    console.error("Error seeding driver profiles:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
