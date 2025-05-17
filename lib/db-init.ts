import { sql } from "./db"
import { initDriverProfilesTable } from "./db/driver-profiles"
import { initOrderBroadcastTables } from "./db/order-broadcast"
import { initWalletTables } from "./db/wallet"

// Function to check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
      )
    `
    return result[0]?.exists || false
  } catch (error) {
    console.error("Error checking if table exists:", { tableName, error })
    return false
  }
}

/**
 * Initialize the database tables for favorites functionality
 */
export async function initFavoritesTables() {
  try {
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
      console.log("Created user_favorites table")
    } else {
      console.log("user_favorites table already exists")
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
      console.log("Created favorite_collections table")
    } else {
      console.log("favorite_collections table already exists")
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
      console.log("Created favorite_collection_items table")
    } else {
      console.log("favorite_collection_items table already exists")
    }

    return true
  } catch (error) {
    console.error("Error initializing favorites tables:", error)
    return false
  }
}

// Initialize the database (create tables if they don't exist)
/**
 * Initialize the user addresses table
 */
export async function initAddressesTables() {
  try {
    // Check if user_addresses table exists
    const addressesTableExists = await tableExists("user_addresses")
    if (!addressesTableExists) {
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
      console.log("Created user_addresses table")
    } else {
      console.log("user_addresses table already exists")
    }

    return true
  } catch (error) {
    console.error("Error initializing addresses tables:", error)
    return false
  }
}

export async function initDatabase(): Promise<void> {
  try {
    console.log("Initializing database tables...")

    // Test database connection first
    try {
      await sql`SELECT 1`;
      console.log("Database connection successful");
    } catch (connectionError) {
      console.error("Database connection failed:", connectionError);
      console.log("Skipping database initialization due to connection issues");
      return;
    }

    try {
      // Initialize favorites tables
      await initFavoritesTables()
    } catch (error) {
      console.error("Error initializing favorites tables:", error)
    }

    try {
      // Initialize addresses tables
      await initAddressesTables()
    } catch (error) {
      console.error("Error initializing addresses tables:", error)
    }

    try {
      // Initialize order broadcast tables
      await initOrderBroadcastTables()
    } catch (error) {
      console.error("Error initializing order broadcast tables:", error)
    }

    try {
      // Initialize wallet tables
      await initWalletTables()
    } catch (error) {
      console.error("Error initializing wallet tables:", error)
    }

    try {
      // Initialize driver profiles table
      await initDriverProfilesTable()
    } catch (error) {
      console.error("Error initializing driver profiles table:", error)
    }

    try {
      // Check if the user_preferences table exists
      const userPreferencesExists = await tableExists("user_preferences")

      if (!userPreferencesExists) {
        console.log("Creating user_preferences table...")
        await sql`
          CREATE TABLE IF NOT EXISTS user_preferences (
            id SERIAL PRIMARY KEY,
            user_id TEXT NOT NULL,
            category_id TEXT,
            subcategory_id TEXT,
            tag TEXT,
            weight FLOAT NOT NULL DEFAULT 1.0,
            created_at TIMESTAMP NOT NULL,
            updated_at TIMESTAMP NOT NULL,
            UNIQUE(user_id, category_id, subcategory_id, tag)
          )
        `
        console.log("Created user_preferences table")
      } else {
        console.log("user_preferences table already exists")
      }
    } catch (error) {
      console.error("Error creating user_preferences table:", error)
    }

    try {
      // Check if the purchase_history table exists
      const purchaseHistoryExists = await tableExists("purchase_history")

      if (!purchaseHistoryExists) {
        console.log("Creating purchase_history table...")
        await sql`
          CREATE TABLE IF NOT EXISTS purchase_history (
            id SERIAL PRIMARY KEY,
            user_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            purchased_at TIMESTAMP NOT NULL
          )
        `
        console.log("Created purchase_history table")
      } else {
        console.log("purchase_history table already exists")
      }
    } catch (error) {
      console.error("Error creating purchase_history table:", error)
    }

    try {
      // Check if the product_recommendations table exists
      const productRecommendationsExists = await tableExists("product_recommendations")

      if (!productRecommendationsExists) {
        console.log("Creating product_recommendations table...")
        await sql`
          CREATE TABLE IF NOT EXISTS product_recommendations (
            id SERIAL PRIMARY KEY,
            user_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            score FLOAT NOT NULL,
            created_at TIMESTAMP NOT NULL,
            UNIQUE(user_id, product_id)
          )
        `
        console.log("Created product_recommendations table")
      } else {
        console.log("product_recommendations table already exists")
      }
    } catch (error) {
      console.error("Error creating product_recommendations table:", error)
    }

    console.log("Database initialization complete")
  } catch (error) {
    console.error("Error initializing database:", error)
    // Don't throw the error, just log it
  }
}
