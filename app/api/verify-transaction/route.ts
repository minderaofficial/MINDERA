import { NextResponse } from "next/server"
import { verifyTransaction } from "@/lib/verifyTransaction"
import { isTransactionUsed } from "@/lib/usedTransactions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transactionId, expectedAmount, senderAddress } = body

    if (!transactionId || !expectedAmount) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters",
        },
        { status: 400 },
      )
    }

    // Check if transaction has already been used before doing the full verification
    if (isTransactionUsed(transactionId)) {
      return NextResponse.json(
        {
          success: false,
          error: "This transaction has already been used for token purchase",
        },
        { status: 400 },
      )
    }

    // Verify the transaction
    const result = await verifyTransaction(transactionId, Number.parseFloat(expectedAmount), senderAddress)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.message,
        },
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
      },
      { status: 500 },
    )
  }
}

