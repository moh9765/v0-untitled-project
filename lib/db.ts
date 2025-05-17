import { neon } from "@neondatabase/serverless";

const DATABASE_URL = 'postgresql://neondb_owner:npg_ed7EglWtc6Bj@ep-silent-butterfly-a2xjsfvf-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require';
if (!DATABASE_URL) throw new Error("DATABASE_URL is missing");

export const sql = neon(DATABASE_URL);

// Helper function for parameterized queries (tagged templates only)
export async function query<T>(strings: TemplateStringsArray, ...params: any[]): Promise<T> {
  try {
    return (await sql(strings, ...params)) as T;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Check if a table exists
export async function tableExists(tableName: string): Promise<boolean> {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
      )
    `;
    return result[0]?.exists || false;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

// Initialize database
export async function initDatabase(): Promise<void> {
  try {
    // Test database connection first
    try {
      await sql`SELECT 1`;
      console.log("Database connection successful");
    } catch (connectionError) {
      console.error("Database connection failed:", connectionError);
      console.log("Skipping database initialization due to connection issues");
      return;
    }

    const tables = [
      {
        name: "user_preferences",
        create: sql`
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
      },
      {
        name: "purchase_history",
        create: sql`
          CREATE TABLE IF NOT EXISTS purchase_history (
            id SERIAL PRIMARY KEY,
            user_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            purchased_at TIMESTAMP NOT NULL
          )
        `
      },
      {
        name: "product_recommendations",
        create: sql`
          CREATE TABLE IF NOT EXISTS product_recommendations (
            id SERIAL PRIMARY KEY,
            user_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            score FLOAT NOT NULL,
            created_at TIMESTAMP NOT NULL,
            UNIQUE(user_id, product_id)
          )
        `
      },
      {
        name: "users",
        create: sql`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            salt TEXT,
            role TEXT NOT NULL DEFAULT 'customer',
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW()
          )
        `
      },
      {
        name: "orders",
        create: sql`
          CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            customer_id INTEGER NOT NULL,
            restaurant_id INTEGER,
            status TEXT NOT NULL DEFAULT 'pending',
            total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
            delivery_address TEXT,
            pickup_address TEXT,
            driver_id INTEGER,
            payment_method TEXT,
            payment_status TEXT,
            notes TEXT,
            FOREIGN KEY (customer_id) REFERENCES users(id)
          )
        `
      },
      {
        name: "order_items",
        create: sql`
          CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL,
            product_id TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            price DECIMAL(10, 2) NOT NULL DEFAULT 0,
            product_name TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT NOW(),
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
          )
        `
      }
    ];

    for (const { name, create } of tables) {
      try {
        if (!(await tableExists(name))) {
          await create;
          console.log(`Created table ${name}`);
        }
      } catch (tableError) {
        console.error(`Error creating table ${name}:`, tableError);
      }
    }

    console.log("Database initialization complete");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Initialize once
initDatabase().catch(console.error);
