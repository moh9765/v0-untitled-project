import { neon } from "@neondatabase/serverless"

// Use the environment variable for the database URL
const DATABASE_URL =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  "postgres://neondb_owner:npg_ed7EglWtc6Bj@ep-silent-butterfly-a2xjsfvf-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require"

// Create a SQL client with the connection string
export const sql = neon(DATABASE_URL)

// Helper function to execute a query with error handling
export async function query<T>(queryString: string, params: any[] = []): Promise<T> {
  try {
    // Use sql.query for parameterized queries
    if (params && params.length > 0) {
      return (await sql.query(queryString, params)) as T
    } else {
      // Use tagged template literal for simple queries
      return (await sql`${queryString}`) as T
    }
  } catch (error) {
    console.error("Database query error:", error)
    throw new Error("Database query failed")
  }
}

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
    // Check if the user_preferences table exists
    const userPreferencesExists = await tableExists("user_preferences")

    if (!userPreferencesExists) {
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
    }

    // Check if the purchase_history table exists
    const purchaseHistoryExists = await tableExists("purchase_history")

    if (!purchaseHistoryExists) {
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
    }

    // Check if the product_recommendations table exists
    const productRecommendationsExists = await tableExists("product_recommendations")

    if (!productRecommendationsExists) {
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
    }

    console.log("Database initialization complete")
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

// Initialize the database when this module is imported
initDatabase().catch(console.error)
