import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { tableExists } from "@/lib/db-init"

// GET /api/favorites?userId=123
export async function GET(request: NextRequest) {
  try {
    // Get userId from query params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Check if favorites table exists
    const favoritesTableExists = await tableExists("user_favorites")
    if (!favoritesTableExists) {
      // Create the table if it doesn't exist
      await sql`
        CREATE TABLE user_favorites (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          item_id TEXT NOT NULL,
          item_type TEXT NOT NULL,
          item_data JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(user_id, item_id, item_type)
        )
      `
    }

    // Check if collections table exists
    const collectionsTableExists = await tableExists("favorite_collections")
    if (!collectionsTableExists) {
      // Create the table if it doesn't exist
      await sql`
        CREATE TABLE favorite_collections (
          id SERIAL PRIMARY KEY,
          collection_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          name_ar TEXT,
          description TEXT,
          description_ar TEXT,
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL,
          UNIQUE(user_id, collection_id)
        )
      `
    }

    // Check if collection items table exists
    const collectionItemsTableExists = await tableExists("favorite_collection_items")
    if (!collectionItemsTableExists) {
      // Create the table if it doesn't exist
      await sql`
        CREATE TABLE favorite_collection_items (
          id SERIAL PRIMARY KEY,
          collection_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          item_id TEXT NOT NULL,
          item_type TEXT NOT NULL,
          item_data JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(collection_id, item_id, item_type)
        )
      `
    }

    // Fetch user's favorites
    const favorites = await sql`
      SELECT item_data FROM user_favorites 
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
    `

    // Fetch user's collections
    const collections = await sql`
      SELECT collection_id, name, name_ar as "nameAr", description, description_ar as "descriptionAr", created_at as "createdAt", updated_at as "updatedAt"
      FROM favorite_collections
      WHERE user_id = ${userId}
      ORDER BY updated_at DESC
    `

    // For each collection, fetch its items
    const collectionsWithItems = await Promise.all(
      collections.map(async (collection: any) => {
        const items = await sql`
          SELECT item_data FROM favorite_collection_items
          WHERE user_id = ${userId} AND collection_id = ${collection.collection_id}
        `
        
        return {
          id: collection.collection_id,
          name: collection.name,
          nameAr: collection.nameAr,
          description: collection.description,
          descriptionAr: collection.descriptionAr,
          items: items.map((item: any) => item.item_data),
          createdAt: collection.createdAt,
          updatedAt: collection.updatedAt
        }
      })
    )

    return NextResponse.json({
      favorites: favorites.map((fav: any) => fav.item_data),
      collections: collectionsWithItems
    })
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json(
      { error: "Failed to fetch favorites", details: (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    )
  }
}

// POST /api/favorites
export async function POST(request: Request) {
  try {
    const { userId, favorites } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!Array.isArray(favorites)) {
      return NextResponse.json({ error: "Favorites must be an array" }, { status: 400 })
    }

    // Check if table exists
    const exists = await tableExists("user_favorites")
    if (!exists) {
      // Create the table if it doesn't exist
      await sql`
        CREATE TABLE user_favorites (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          item_id TEXT NOT NULL,
          item_type TEXT NOT NULL,
          item_data JSONB NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(user_id, item_id, item_type)
        )
      `
    }

    // Clear existing favorites for this user
    await sql`DELETE FROM user_favorites WHERE user_id = ${userId}`

    // Insert new favorites
    if (favorites.length > 0) {
      for (const item of favorites) {
        await sql`
          INSERT INTO user_favorites (user_id, item_id, item_type, item_data, updated_at)
          VALUES (${userId}, ${item.id}, ${item.type}, ${JSON.stringify(item)}, NOW())
          ON CONFLICT (user_id, item_id, item_type) 
          DO UPDATE SET item_data = ${JSON.stringify(item)}, updated_at = NOW()
        `
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving favorites:", error)
    return NextResponse.json(
      { error: "Failed to save favorites", details: (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    )
  }
}
