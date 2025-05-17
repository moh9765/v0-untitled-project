import { NextResponse } from "next/server"
import { getUserWallet, addFundsToWallet, getWalletTransactions, withdrawFromWallet } from "@/lib/db/wallet"

// GET /api/wallet?userId=123
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user wallet
    const wallet = await getUserWallet(userId)
    
    // Get recent transactions
    const transactions = await getWalletTransactions(userId, 10)

    return NextResponse.json({ 
      wallet,
      transactions
    })
  } catch (error) {
    console.error("Error getting wallet:", error)
    return NextResponse.json({ error: "Failed to get wallet" }, { status: 500 })
  }
}

// POST /api/wallet/add-funds
export async function POST(request: Request) {
  try {
    const { userId, amount, description, referenceId } = await request.json()

    if (!userId || !amount || !description) {
      return NextResponse.json({ 
        error: "User ID, amount, and description are required" 
      }, { status: 400 })
    }

    // Validate amount
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ 
        error: "Amount must be a positive number" 
      }, { status: 400 })
    }

    // Add funds to wallet
    const result = await addFundsToWallet(
      userId, 
      numAmount, 
      description, 
      referenceId
    )

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("Error adding funds to wallet:", error)
    return NextResponse.json({ error: "Failed to add funds to wallet" }, { status: 500 })
  }
}
