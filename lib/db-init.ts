import { sql } from "./db"

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

// Initialize the database (create tables if they don't exist)
export async function initDatabase(): Promise<void> {
  try {
    console.log("Initializing database tables...")

    // Check if the user_preferences table exists
    const userPreferencesExists = await tableExists("user_preferences")

    if (!userPreferencesExists) {
      console.log("Creating user_preferences table...")
      await sql`
        CREATE TABLE user_preferences (
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

    // Check if the purchase_history table exists
    const purchaseHistoryExists = await tableExists("purchase_history")

    if (!purchaseHistoryExists) {
      console.log("Creating purchase_history table...")
      await sql`
        CREATE TABLE purchase_history (
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

    // Check if the product_recommendations table exists
    const productRecommendationsExists = await tableExists("product_recommendations")

    if (!productRecommendationsExists) {
      console.log("Creating product_recommendations table...")
      await sql`
        CREATE TABLE product_recommendations (
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

    console.log("Database initialization complete")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}
