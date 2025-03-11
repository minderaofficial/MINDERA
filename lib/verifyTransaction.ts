import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { isTransactionUsed, markTransactionAsUsed } from "./usedTransactions"

// Get the Solana RPC URL from environment variables
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com"
console.log("Using Solana RPC URL:", SOLANA_RPC_URL)

// Create connection to Solana network
const connection = new Connection(SOLANA_RPC_URL)

// Presale wallet address
const PRESALE_WALLET_ADDRESS = "946svTRVZa4KGU8NkvVSJwU9NkHdzr9Q5LFkhVHQUwdh"

export async function verifyTransaction(transactionId: string, expectedAmount: number, senderAddress?: string) {
  try {
    console.log("Verifying transaction:", transactionId, "Expected amount:", expectedAmount)

    // Basic validation of transaction ID format
    if (!transactionId || transactionId.length < 43 || transactionId.length > 88) {
      return {
        success: false,
        message: "Invalid transaction ID format",
      }
    }

    // Check if transaction has already been used
    if (isTransactionUsed(transactionId)) {
      return {
        success: false,
        message: "This transaction has already been used for token purchase",
      }
    }

    // Fetch the transaction with more robust error handling
    let tx
    try {
      console.log("Fetching transaction from Solana...")
      tx = await connection.getTransaction(transactionId, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      })
      console.log("Transaction fetched:", tx ? "Success" : "Not found")
    } catch (error: any) {
      console.error("Error fetching transaction:", error)

      // Handle specific error types
      if (
        error.message &&
        (error.message.includes("WrongSize") || error.message.includes("failed to get transaction"))
      ) {
        return {
          success: false,
          message: "Transaction not found or still processing. Please check the ID and try again in a few moments.",
        }
      }

      return {
        success: false,
        message: `Failed to fetch transaction: ${error.message || "Unknown error"}`,
      }
    }

    // Check if transaction exists
    if (!tx) {
      return {
        success: false,
        message: "Transaction not found. It may still be processing or may not exist.",
      }
    }

    // Verify transaction is not failed
    if (tx.meta?.err) {
      return {
        success: false,
        message: "Transaction failed on the blockchain",
      }
    }

    // Get pre and post balances
    const { preBalances, postBalances } = tx.meta!

    // Find the index of the recipient in the account keys
    const accountKeys = tx.transaction.message.accountKeys
    const recipientIndex = accountKeys.findIndex((key) => key.toString() === PRESALE_WALLET_ADDRESS)

    if (recipientIndex === -1) {
      return {
        success: false,
        message: "Transaction is not sent to the presale wallet",
      }
    }

    // Calculate the amount transferred to the presale wallet
    const amountTransferred = (postBalances[recipientIndex] - preBalances[recipientIndex]) / LAMPORTS_PER_SOL
    console.log("Amount transferred:", amountTransferred, "SOL")

    // Verify the sender if provided
    if (senderAddress) {
      const senderIndex = accountKeys.findIndex((key) => key.toString() === senderAddress)

      if (senderIndex === -1) {
        return {
          success: false,
          message: "Transaction is not from the connected wallet",
        }
      }
    }

    // Verify the amount (with a small tolerance for fees)
    const tolerance = 0.001 // Small tolerance for calculation differences

    if (Math.abs(amountTransferred - expectedAmount) > tolerance) {
      return {
        success: false,
        message: `Amount transferred (${amountTransferred} SOL) does not match expected amount (${expectedAmount} SOL)`,
      }
    }

    // Mark this transaction as used to prevent double-counting
    markTransactionAsUsed(transactionId)

    // All verifications passed
    return {
      success: true,
      message: "Transaction verified successfully",
      data: {
        amount: amountTransferred,
        recipient: PRESALE_WALLET_ADDRESS,
        timestamp: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : null,
      },
    }
  } catch (err: any) {
    console.error("Verification error:", err)
    return {
      success: false,
      message: err.message || "Failed to verify transaction",
    }
  }
}

