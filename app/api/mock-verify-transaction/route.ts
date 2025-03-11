import { NextResponse } from "next/server"

// This is a mock endpoint for testing transaction verification
// In a real implementation, you would use the actual verification logic

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

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For testing purposes, we'll accept any transaction ID that starts with "success"
    // and reject any that starts with "fail" or "error"
    if (transactionId.toLowerCase().startsWith("success")) {
      return NextResponse.json({
        success: true,
        message: "Transaction verified successfully",
        data: {
          amount: Number.parseFloat(expectedAmount),
          recipient: "946svTRVZa4KGU8NkvVSJwU9NkHdzr9Q5LFkhVHQUwdh",
          timestamp: new Date().toISOString(),
        },
      })
    } else if (transactionId.toLowerCase().startsWith("fail")) {
      return NextResponse.json(
        {
          success: false,
          error: "Transaction failed on the blockchain",
        },
        { status: 400 },
      )
    } else if (transactionId.toLowerCase().startsWith("error")) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to get transaction: Invalid param: WrongSize",
        },
        { status: 400 },
      )
    } else if (transactionId.toLowerCase().startsWith("notfound")) {
      return NextResponse.json(
        {
          success: false,
          error: "Transaction not found. It may still be processing or may not exist.",
        },
        { status: 400 },
      )
    } else {
      // For any other transaction ID, randomly succeed or fail
      const shouldSucceed = Math.random() > 0.3

      if (shouldSucceed) {
        return NextResponse.json({
          success: true,
          message: "Transaction verified successfully",
          data: {
            amount: Number.parseFloat(expectedAmount),
            recipient: "946svTRVZa4KGU8NkvVSJwU9NkHdzr9Q5LFkhVHQUwdh",
            timestamp: new Date().toISOString(),
          },
        })
      } else {
        const errors = [
          "Transaction not found",
          "Amount transferred does not match expected amount",
          "Transaction is not from the connected wallet",
          "Failed to get transaction: Invalid param: WrongSize",
        ]
        const randomError = errors[Math.floor(Math.random() * errors.length)]

        return NextResponse.json(
          {
            success: false,
            error: randomError,
          },
          { status: 400 },
        )
      }
    }
  } catch (error: any) {
    console.error("API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

