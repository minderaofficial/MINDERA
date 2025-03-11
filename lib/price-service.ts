// Service to fetch and manage cryptocurrency prices
export interface PriceData {
  usd: number
  usd_24h_change: number
  last_updated_at: number
}

export async function getSolanaPrice(): Promise<PriceData> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true",
      { next: { revalidate: 60 } }, // Cache for 60 seconds
    )

    if (!response.ok) {
      throw new Error("Failed to fetch Solana price")
    }

    const data = await response.json()
    return data.solana as PriceData
  } catch (error) {
    console.error("Error fetching Solana price:", error)
    // Return fallback data if API fails
    return {
      usd: 150.42, // Fallback price
      usd_24h_change: 0,
      last_updated_at: Date.now() / 1000,
    }
  }
}

// Calculate token amount based on SOL amount and current SOL price
export function calculateTokenAmount(solAmount: number, solPrice: number, tokenPrice: number): number {
  if (!solAmount || !solPrice || !tokenPrice) return 0

  const usdValue = solAmount * solPrice
  return usdValue / tokenPrice
}

// Calculate SOL amount needed to buy a specific amount of tokens
export function calculateSolAmount(tokenAmount: number, solPrice: number, tokenPrice: number): number {
  if (!tokenAmount || !solPrice || !tokenPrice) return 0

  const usdValue = tokenAmount * tokenPrice
  return usdValue / solPrice
}

