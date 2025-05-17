import { sql } from "@/lib/db";
import { tableExists } from "@/lib/db-init";

/**
 * Initialize the driver profiles table
 */
export async function initDriverProfilesTable() {
  try {
    // Check if driver_profiles table exists
    const profilesTableExists = await tableExists("driver_profiles");
    
    if (!profilesTableExists) {
      // Create the table if it doesn't exist
      await sql`
        CREATE TABLE driver_profiles (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'offline',
          rating DECIMAL(3, 1) DEFAULT 5.0,
          total_deliveries INTEGER DEFAULT 0,
          acceptance_rate INTEGER DEFAULT 100,
          vehicle_type VARCHAR(20),
          vehicle_model VARCHAR(100),
          license_plate VARCHAR(20),
          current_lat DECIMAL(10, 7),
          current_lng DECIMAL(10, 7),
          current_address TEXT,
          city VARCHAR(100),
          last_active TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE(user_id)
        )
      `;
      console.log("Created driver_profiles table");
    } else {
      console.log("driver_profiles table already exists");
    }
    
    return true;
  } catch (error) {
    console.error("Error initializing driver profiles table:", error);
    return false;
  }
}

/**
 * Get driver profile by user ID
 */
export async function getDriverProfile(userId: number | string) {
  try {
    const result = await sql`
      SELECT * FROM driver_profiles WHERE user_id = ${userId}
    `;
    
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching driver profile:", error);
    throw error;
  }
}

/**
 * Create or update driver profile
 */
export async function upsertDriverProfile(
  userId: number | string,
  data: {
    status?: string;
    rating?: number;
    total_deliveries?: number;
    acceptance_rate?: number;
    vehicle_type?: string;
    vehicle_model?: string;
    license_plate?: string;
    current_lat?: number;
    current_lng?: number;
    current_address?: string;
    city?: string;
    last_active?: Date;
  }
) {
  try {
    // Check if profile exists
    const profile = await getDriverProfile(userId);
    
    if (profile) {
      // Update existing profile
      const result = await sql`
        UPDATE driver_profiles
        SET
          status = COALESCE(${data.status}, status),
          rating = COALESCE(${data.rating}, rating),
          total_deliveries = COALESCE(${data.total_deliveries}, total_deliveries),
          acceptance_rate = COALESCE(${data.acceptance_rate}, acceptance_rate),
          vehicle_type = COALESCE(${data.vehicle_type}, vehicle_type),
          vehicle_model = COALESCE(${data.vehicle_model}, vehicle_model),
          license_plate = COALESCE(${data.license_plate}, license_plate),
          current_lat = COALESCE(${data.current_lat}, current_lat),
          current_lng = COALESCE(${data.current_lng}, current_lng),
          current_address = COALESCE(${data.current_address}, current_address),
          city = COALESCE(${data.city}, city),
          last_active = COALESCE(${data.last_active}, last_active),
          updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `;
      
      return result[0];
    } else {
      // Create new profile
      const result = await sql`
        INSERT INTO driver_profiles (
          user_id,
          status,
          rating,
          total_deliveries,
          acceptance_rate,
          vehicle_type,
          vehicle_model,
          license_plate,
          current_lat,
          current_lng,
          current_address,
          city,
          last_active
        )
        VALUES (
          ${userId},
          ${data.status || 'offline'},
          ${data.rating || 5.0},
          ${data.total_deliveries || 0},
          ${data.acceptance_rate || 100},
          ${data.vehicle_type},
          ${data.vehicle_model},
          ${data.license_plate},
          ${data.current_lat},
          ${data.current_lng},
          ${data.current_address},
          ${data.city},
          ${data.last_active || new Date()}
        )
        RETURNING *
      `;
      
      return result[0];
    }
  } catch (error) {
    console.error("Error upserting driver profile:", error);
    throw error;
  }
}
