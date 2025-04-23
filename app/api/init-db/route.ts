import { NextResponse } from "next/server"
import { initDatabase } from "@/lib/db-init"

export async function GET() {
  try {
    await initDatabase()
    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ success: false, error: "Failed to initialize database" }, { status: 500 })
  }
}
