import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { tableExists } from "@/lib/db-init"
import type { FavoriteCollection } from "@/hooks/useFavorites"

// POST /api/favorites/collections
export async function POST(request: Request) {
  try {
    const { userId, collections } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (!Array.isArray(collections)) {
      return NextResponse.json({ error: "Collections must be an array" }, { status: 400 })
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

    // Get existing collection IDs for this user
    const existingCollections = await sql`
      SELECT collection_id FROM favorite_collections WHERE user_id = ${userId}
    `
    const existingCollectionIds = existingCollections.map((c: any) => c.collection_id)
    
    // Find collections to delete (those in DB but not in the new list)
    const newCollectionIds = collections.map((c: FavoriteCollection) => c.id)
    const collectionsToDelete = existingCollectionIds.filter(id => !newCollectionIds.includes(id))
    
    // Delete collections that are no longer in the list
    if (collectionsToDelete.length > 0) {
      for (const collectionId of collectionsToDelete) {
        // Delete collection items first
        await sql`DELETE FROM favorite_collection_items WHERE user_id = ${userId} AND collection_id = ${collectionId}`
        // Then delete the collection
        await sql`DELETE FROM favorite_collections WHERE user_id = ${userId} AND collection_id = ${collectionId}`
      }
    }
    
    // Update or insert collections
    for (const collection of collections) {
      // Upsert the collection
      await sql`
        INSERT INTO favorite_collections (
          collection_id, user_id, name, name_ar, description, description_ar, created_at, updated_at
        ) VALUES (
          ${collection.id}, ${userId}, ${collection.name}, ${collection.nameAr || null}, 
          ${collection.description || null}, ${collection.descriptionAr || null}, 
          ${new Date(collection.createdAt)}, ${new Date(collection.updatedAt)}
        )
        ON CONFLICT (user_id, collection_id) 
        DO UPDATE SET 
          name = ${collection.name},
          name_ar = ${collection.nameAr || null},
          description = ${collection.description || null},
          description_ar = ${collection.descriptionAr || null},
          updated_at = ${new Date(collection.updatedAt)}
      `
      
      // Delete existing items for this collection
      await sql`DELETE FROM favorite_collection_items WHERE user_id = ${userId} AND collection_id = ${collection.id}`
      
      // Insert new items
      if (collection.items && collection.items.length > 0) {
        for (const item of collection.items) {
          await sql`
            INSERT INTO favorite_collection_items (
              collection_id, user_id, item_id, item_type, item_data
            ) VALUES (
              ${collection.id}, ${userId}, ${item.id}, ${item.type}, ${JSON.stringify(item)}
            )
            ON CONFLICT (collection_id, item_id, item_type) 
            DO UPDATE SET item_data = ${JSON.stringify(item)}
          `
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving collections:", error)
    return NextResponse.json(
      { error: "Failed to save collections", details: (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    )
  }
}
