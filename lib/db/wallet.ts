import { sql } from "@/lib/db"
import { tableExists } from "@/lib/db-init"

// Initialize the wallet tables if they don't exist
export async function initWalletTables() {
  try {
    // Check if user_wallets table exists
    const walletTableExists = await tableExists("user_wallets")
    if (!walletTableExists) {
      await sql`
        CREATE TABLE user_wallets (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE(user_id)
        )
      `
      console.log("Created user_wallets table")
    }

    // Check if wallet_transactions table exists
    const transactionsTableExists = await tableExists("wallet_transactions")
    if (!transactionsTableExists) {
      await sql`
        CREATE TABLE wallet_transactions (
          id SERIAL PRIMARY KEY,
          user_id TEXT NOT NULL,
          amount DECIMAL(10, 2) NOT NULL,
          transaction_type VARCHAR(20) NOT NULL,
          description TEXT NOT NULL,
          reference_id TEXT,
          status VARCHAR(20) NOT NULL DEFAULT 'completed',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `
      console.log("Created wallet_transactions table")
    }

    return true
  } catch (error) {
    console.error("Error initializing wallet tables:", error)
    return false
  }
}

// Get user wallet
export async function getUserWallet(userId: string) {
  try {
    await initWalletTables()

    // Check if user has wallet record
    const userWallet = await sql`
      SELECT * FROM user_wallets WHERE user_id = ${userId}
    `

    // If no record exists, create one
    if (userWallet.length === 0) {
      const newUserWallet = await sql`
        INSERT INTO user_wallets (user_id, balance)
        VALUES (${userId}, 0)
        RETURNING *
      `
      return newUserWallet[0]
    }

    return userWallet[0]
  } catch (error) {
    console.error("Error getting user wallet:", error)
    throw new Error("Failed to get user wallet")
  }
}

// Add funds to wallet
export async function addFundsToWallet(
  userId: string, 
  amount: number, 
  description: string,
  referenceId?: string
) {
  try {
    await initWalletTables()

    // Get current user wallet
    const userWallet = await getUserWallet(userId)
    
    // Calculate new balance
    const newBalance = parseFloat(userWallet.balance) + amount
    
    // Update user wallet
    await sql`
      UPDATE user_wallets 
      SET balance = ${newBalance}, 
          updated_at = NOW()
      WHERE user_id = ${userId}
    `

    // Record transaction
    const transaction = await sql`
      INSERT INTO wallet_transactions (
        user_id, 
        amount, 
        transaction_type, 
        description,
        reference_id,
        status
      )
      VALUES (
        ${userId}, 
        ${amount}, 
        'topup', 
        ${description},
        ${referenceId || null},
        'completed'
      )
      RETURNING *
    `

    return {
      balance: newBalance,
      transaction: transaction[0]
    }
  } catch (error) {
    console.error("Error adding funds to wallet:", error)
    throw new Error("Failed to add funds to wallet")
  }
}

// Get wallet transactions
export async function getWalletTransactions(userId: string, limit: number = 10) {
  try {
    await initWalletTables()

    const transactions = await sql`
      SELECT * FROM wallet_transactions 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    return transactions
  } catch (error) {
    console.error("Error getting wallet transactions:", error)
    throw new Error("Failed to get wallet transactions")
  }
}

// Withdraw funds from wallet
export async function withdrawFromWallet(
  userId: string, 
  amount: number, 
  description: string,
  referenceId?: string
) {
  try {
    await initWalletTables()

    // Get current user wallet
    const userWallet = await getUserWallet(userId)
    
    // Check if user has enough balance
    if (parseFloat(userWallet.balance) < amount) {
      throw new Error("Insufficient balance")
    }
    
    // Calculate new balance
    const newBalance = parseFloat(userWallet.balance) - amount
    
    // Update user wallet
    await sql`
      UPDATE user_wallets 
      SET balance = ${newBalance}, 
          updated_at = NOW()
      WHERE user_id = ${userId}
    `

    // Record transaction
    const transaction = await sql`
      INSERT INTO wallet_transactions (
        user_id, 
        amount, 
        transaction_type, 
        description,
        reference_id,
        status
      )
      VALUES (
        ${userId}, 
        ${-amount}, 
        'withdraw', 
        ${description},
        ${referenceId || null},
        'completed'
      )
      RETURNING *
    `

    return {
      balance: newBalance,
      transaction: transaction[0]
    }
  } catch (error) {
    console.error("Error withdrawing from wallet:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to withdraw from wallet")
  }
}
