import { NextResponse } from "next/server"

// This is a mock API endpoint for the presale
// In a real implementation, you would interact with your blockchain

export async function GET() {
  // Mock data for the presale
  const presaleData = {
    currentPrice: 0.0025,
    raisedAmount: 1245000,
    hardCap: 2000000,
    percentageRaised: 62.25,
    stages: [
      { name: "Stage 1", price: 0.0025, active: true },
      { name: "Stage 2", price: 0.0035, active: false },
      { name: "Stage 3", price: 0.005, active: false },
    ],
  }

  return NextResponse.json(presaleData)
}

