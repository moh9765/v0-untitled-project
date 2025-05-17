import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/db/users";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const user = await verifyUser(email, password);

    if (!user) {
      return NextResponse.json({ success: false });
    }

    // Include userId in the response so it can be stored in localStorage
    const response = NextResponse.json({
      success: true,
      role: user.role,
      userId: user.userId // Using camelCase userId from the user object
    })

    // Also set in cookies for server-side auth
    response.cookies.set("session", user.userId, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return response;
  } catch (error) {
    console.error("API login error:", error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}

{/* register
  import { NextResponse } from "next/server"
import { createUser } from "@/lib/db/users"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create user
    const user = await createUser({
      name,
      email,
      password,
      role: role || "customer",
    })

    // Return success response (without password)
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error("API registration error:", error)

    // Handle duplicate email error
    if (error.message?.includes("already exists")) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 409 })
    }

    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
*/}