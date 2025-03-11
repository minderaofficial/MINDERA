import { NextResponse } from "next/server"
import { isTransactionUsed, getUsedTransactions } from "@/lib/usedTransactions"

export async function GET(request: Request) {
  // Get the transaction ID from the URL
  const url = new URL(request.url)
  const transactionId = url.searchParams.get("id")

  if (!transactionId) {
    return NextResponse.json(
      {
        success: false,
        error: "Missing transaction ID",
      },
      { status: 400 },
    )
  }

  return NextResponse.json({
    success: true,
    isUsed: isTransactionUsed(transactionId),
  })
}

// Admin endpoint to see all used transactions (would be protected in production)
export async function POST() {
  return NextResponse.json({
    success: true,
    usedTransactions: getUsedTransactions(),
  })
}

