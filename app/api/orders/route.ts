import { NextResponse } from "next/server";
import { sql } from "@/lib/db"; // Assuming you're using the Neon library or a pg-like query function

export async function POST(req: Request) {
  try {
    const { customer_id } = await req.json();

    console.log("Received customer_id:", customer_id); // Log the received customer_id

    // Ensure customer_id is a valid integer
    if (!customer_id ) {
      return NextResponse.json(
        { error: "Invalid or missing customer_id" },
        { status: 400 }
      );
    }

    // Query to fetch orders based on customer_id
    const result = await sql`
      SELECT * FROM orders inner join users on users.id = orders.customer_id where email = ${customer_id}  ORDER BY orders.created_at DESC
    `;

    // Check if the result has rows, depending on how your query results are structured
    if (result && result.length === 0) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    // Assuming `result` contains the rows directly (adjust based on your query result structure)
    return NextResponse.json({ orders: result }, { status: 200 });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
