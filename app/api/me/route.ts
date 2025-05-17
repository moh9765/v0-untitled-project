import { getUserById } from "@/lib/db/users"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = req.cookies.get("session")?.value

  // If no session cookie, return a 200 response with null user
  // This prevents 401 errors that might trigger unnecessary redirects
  if (!session) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  try {
    const user = await getUserById(session)
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
