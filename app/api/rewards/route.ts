import { NextResponse } from "next/server"
import { getUserRewards, addRewardPoints, getRewardTransactions, updateTotalSpent } from "@/lib/db/rewards"

// GET /api/rewards?userId=123
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user rewards
    const rewards = await getUserRewards(parseInt(userId))
    
    // Get recent transactions
    const transactions = await getRewardTransactions(parseInt(userId), 5)

    // Calculate next level threshold
    let nextLevel = null
    let pointsNeeded = 0
    let progress = 100

    if (rewards.level === "Bronze") {
      nextLevel = "Silver"
      pointsNeeded = 200 - rewards.points
      progress = (rewards.points / 200) * 100
    } else if (rewards.level === "Silver") {
      nextLevel = "Gold"
      pointsNeeded = 500 - rewards.points
      progress = ((rewards.points - 200) / 300) * 100
    } else if (rewards.level === "Gold") {
      nextLevel = "Platinum"
      pointsNeeded = 1000 - rewards.points
      progress = ((rewards.points - 500) / 500) * 100
    } else {
      // Platinum level - no next level
      nextLevel = null
      pointsNeeded = 0
      progress = 100
    }

    return NextResponse.json({
      rewards,
      transactions,
      nextThreshold: {
        currentLevel: rewards.level,
        nextLevel,
        pointsNeeded,
        progress: Math.min(Math.max(progress, 0), 100) // Ensure progress is between 0-100
      }
    })
  } catch (error) {
    console.error("Error fetching rewards:", error)
    return NextResponse.json({ error: "Failed to fetch rewards" }, { status: 500 })
  }
}

// POST /api/rewards
export async function POST(request: Request) {
  try {
    const { userId, points, description, transactionType, referenceId } = await request.json()

    if (!userId || !points || !description) {
      return NextResponse.json({ 
        error: "User ID, points, and description are required" 
      }, { status: 400 })
    }

    // Add points to user
    const result = await addRewardPoints(
      parseInt(userId), 
      points, 
      description, 
      transactionType || 'earned',
      referenceId
    )

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("Error adding reward points:", error)
    return NextResponse.json({ error: "Failed to add reward points" }, { status: 500 })
  }
}

// PUT /api/rewards/spent
export async function PUT(request: Request) {
  try {
    const { userId, amount } = await request.json()

    if (!userId || !amount) {
      return NextResponse.json({ 
        error: "User ID and amount are required" 
      }, { status: 400 })
    }

    // Update total spent
    const result = await updateTotalSpent(parseInt(userId), amount)

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error("Error updating total spent:", error)
    return NextResponse.json({ error: "Failed to update total spent" }, { status: 500 })
  }
}
