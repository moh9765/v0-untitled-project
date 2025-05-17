import { sql } from "@/lib/db"
import { tableExists } from "@/lib/db-init"

// Initialize the rewards table if it doesn't exist
export async function initRewardsTable() {
  try {
    const exists = await tableExists("user_rewards")
    if (!exists) {
      await sql`
        CREATE TABLE user_rewards (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          points INTEGER NOT NULL DEFAULT 0,
          level VARCHAR(20) NOT NULL DEFAULT 'Bronze',
          total_spent DECIMAL(10, 2) NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(user_id)
        )
      `
      console.log("Created user_rewards table")
    }

    const transactionsExists = await tableExists("reward_transactions")
    if (!transactionsExists) {
      await sql`
        CREATE TABLE reward_transactions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          points INTEGER NOT NULL,
          description TEXT NOT NULL,
          transaction_type VARCHAR(20) NOT NULL,
          reference_id TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `
      console.log("Created reward_transactions table")
    }

    return true
  } catch (error) {
    console.error("Error initializing rewards tables:", error)
    return false
  }
}

// Get user rewards
export async function getUserRewards(userId: number) {
  try {
    await initRewardsTable()

    // Check if user has rewards record
    const userRewards = await sql`
      SELECT * FROM user_rewards WHERE user_id = ${userId}
    `

    // If no record exists, create one
    if (userRewards.length === 0) {
      const newUserRewards = await sql`
        INSERT INTO user_rewards (user_id, points, level, total_spent)
        VALUES (${userId}, 0, 'Bronze', 0)
        RETURNING *
      `
      return newUserRewards[0]
    }

    return userRewards[0]
  } catch (error) {
    console.error("Error getting user rewards:", error)
    throw new Error("Failed to get user rewards")
  }
}

// Add points to user
export async function addRewardPoints(
  userId: number, 
  points: number, 
  description: string, 
  transactionType: string = 'earned',
  referenceId?: string
) {
  try {
    await initRewardsTable()

    // Get current user rewards
    const userRewards = await getUserRewards(userId)
    
    // Calculate new points and update level
    const newPoints = userRewards.points + points
    let level = userRewards.level
    
    // Update level based on total points
    if (newPoints >= 1000) {
      level = 'Platinum'
    } else if (newPoints >= 500) {
      level = 'Gold'
    } else if (newPoints >= 200) {
      level = 'Silver'
    } else {
      level = 'Bronze'
    }

    // Update user rewards
    await sql`
      UPDATE user_rewards 
      SET points = ${newPoints}, 
          level = ${level}, 
          updated_at = NOW()
      WHERE user_id = ${userId}
    `

    // Record transaction
    await sql`
      INSERT INTO reward_transactions 
      (user_id, points, description, transaction_type, reference_id, created_at)
      VALUES 
      (${userId}, ${points}, ${description}, ${transactionType}, ${referenceId}, NOW())
    `

    return {
      points: newPoints,
      level,
      pointsAdded: points
    }
  } catch (error) {
    console.error("Error adding reward points:", error)
    throw new Error("Failed to add reward points")
  }
}

// Update total spent
export async function updateTotalSpent(userId: number, amount: number) {
  try {
    await initRewardsTable()

    // Get current user rewards
    const userRewards = await getUserRewards(userId)
    
    // Calculate new total spent
    const newTotalSpent = parseFloat(userRewards.total_spent) + amount
    
    // Update user rewards
    await sql`
      UPDATE user_rewards 
      SET total_spent = ${newTotalSpent}, 
          updated_at = NOW()
      WHERE user_id = ${userId}
    `

    return {
      totalSpent: newTotalSpent
    }
  } catch (error) {
    console.error("Error updating total spent:", error)
    throw new Error("Failed to update total spent")
  }
}

// Get reward transactions
export async function getRewardTransactions(userId: number, limit: number = 10) {
  try {
    await initRewardsTable()

    const transactions = await sql`
      SELECT * FROM reward_transactions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return transactions
  } catch (error) {
    console.error("Error getting reward transactions:", error)
    throw new Error("Failed to get reward transactions")
  }
}
