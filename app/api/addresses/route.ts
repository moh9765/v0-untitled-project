import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { tableExists } from "@/lib/db-init"
import { UserAddress } from "@/lib/types"

// GET /api/addresses?userId=123
export async function GET(request: NextRequest) {
  try {
    // Get userId from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if addresses table exists
    const addressesTableExists = await tableExists("user_addresses")
    if (!addressesTableExists) {
      return NextResponse.json({ addresses: [] })
    }

    // Get user addresses
    const addresses = await sql`
      SELECT * FROM user_addresses 
      WHERE user_id = ${userId}
      ORDER BY is_default DESC, created_at DESC
    `

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
  }
}

// POST /api/addresses
export async function POST(request: Request) {
  try {
    const { userId, address } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!address || !address.street_address || !address.city || !address.state || !address.zip_code) {
      return NextResponse.json({ 
        error: "Address must include street_address, city, state, and zip_code" 
      }, { status: 400 })
    }

    // Check if table exists
    const exists = await tableExists("user_addresses")
    if (!exists) {
      // Create the table if it doesn't exist
      await sql`
        CREATE TABLE user_addresses (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          street_address TEXT NOT NULL,
          apartment TEXT,
          city TEXT NOT NULL,
          state TEXT NOT NULL,
          zip_code TEXT NOT NULL,
          special_instructions TEXT,
          is_default BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `
    }

    // If this is set as default, unset any existing default addresses
    if (address.is_default) {
      await sql`
        UPDATE user_addresses 
        SET is_default = false 
        WHERE user_id = ${userId} AND is_default = true
      `
    }

    // Insert the new address
    const result = await sql`
      INSERT INTO user_addresses (
        user_id, 
        street_address, 
        apartment, 
        city, 
        state, 
        zip_code, 
        special_instructions, 
        is_default
      )
      VALUES (
        ${userId}, 
        ${address.street_address}, 
        ${address.apartment || null}, 
        ${address.city}, 
        ${address.state}, 
        ${address.zip_code}, 
        ${address.special_instructions || null}, 
        ${address.is_default || false}
      )
      RETURNING *
    `

    return NextResponse.json({ success: true, address: result[0] })
  } catch (error) {
    console.error("Error adding address:", error)
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 })
  }
}

// PUT /api/addresses/:id
export async function PUT(request: Request) {
  try {
    const { userId, addressId, address } = await request.json()

    if (!userId || !addressId) {
      return NextResponse.json({ error: "User ID and Address ID are required" }, { status: 400 })
    }

    if (!address || !address.street_address || !address.city || !address.state || !address.zip_code) {
      return NextResponse.json({ 
        error: "Address must include street_address, city, state, and zip_code" 
      }, { status: 400 })
    }

    // If this is set as default, unset any existing default addresses
    if (address.is_default) {
      await sql`
        UPDATE user_addresses 
        SET is_default = false 
        WHERE user_id = ${userId} AND is_default = true AND id != ${addressId}
      `
    }

    // Update the address
    const result = await sql`
      UPDATE user_addresses 
      SET 
        street_address = ${address.street_address},
        apartment = ${address.apartment || null},
        city = ${address.city},
        state = ${address.state},
        zip_code = ${address.zip_code},
        special_instructions = ${address.special_instructions || null},
        is_default = ${address.is_default || false},
        updated_at = NOW()
      WHERE id = ${addressId} AND user_id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, address: result[0] })
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

// DELETE /api/addresses/:id
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const addressId = url.searchParams.get("id")
    const userId = url.searchParams.get("userId")

    if (!addressId || !userId) {
      return NextResponse.json({ error: "Address ID and User ID are required" }, { status: 400 })
    }

    // Delete the address
    const result = await sql`
      DELETE FROM user_addresses 
      WHERE id = ${addressId} AND user_id = ${userId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, id: result[0].id })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}
