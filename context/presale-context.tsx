"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "./wallet-context"
import { useToast } from "@/components/ui/use-toast"
import { getSolanaPrice, type PriceData, calculateTokenAmount } from "@/lib/price-service"
import { getPresaleState, subscribeToPresaleState, updatePresaleState } from "@/lib/presale-state"

// Token supply constants
const TOTAL_TOKEN_SUPPLY = 1_000_000_000 // 1 billion MND tokens
const PRESALE_ALLOCATION = 300_000_000 // 300 million MND tokens for presale

interface PresaleStage {
  name: string
  price: number
  active: boolean
}

interface PresaleData {
  currentPrice: number
  raisedAmount: number
  hardCap: number
  percentageRaised: number
  stages: PresaleStage[]
  solanaPrice: PriceData | null
  lastUpdated: Date | null
  totalTokensSold: number
  remainingTokens: number
  isPaused: boolean
  isReleased: boolean // New field to track if presale has been released
}

interface PresaleContextType {
  presaleData: PresaleData
  recordPurchase: (amount: string) => Promise<any>
  refreshData: () => Promise<void>
  calculateTokens: (solAmount: string) => number
  isLoading: boolean
  checkTokenAvailability: (tokenAmount: number) => boolean
  setPaused: (paused: boolean) => void
  setReleased: (released: boolean) => void // New function to set release state
}

// Get initial state from shared service
const sharedState = getPresaleState()

const defaultPresaleData: PresaleData = {
  currentPrice: 0.0025,
  raisedAmount: 0, // Start at 0
  hardCap: 10000,
  percentageRaised: 0, // Start at 0
  stages: [
    { name: "Stage 1", price: 0.0025, active: true },
    { name: "Stage 2", price: 0.0035, active: false },
    { name: "Stage 3", price: 0.005, active: false },
  ],
  solanaPrice: null,
  lastUpdated: null,
  totalTokensSold: 0, // Start at 0
  remainingTokens: PRESALE_ALLOCATION,
  isPaused: sharedState.isPaused, // Use shared state
  isReleased: sharedState.isReleased, // Use shared state
}

const PresaleContext = createContext<PresaleContextType>({
  presaleData: defaultPresaleData,
  recordPurchase: async () => {
    throw new Error("Not implemented")
  },
  refreshData: async () => {},
  calculateTokens: () => 0,
  isLoading: false,
  checkTokenAvailability: () => true,
  setPaused: () => {},
  setReleased: () => {},
})

export function PresaleProvider({ children }: { children: ReactNode }) {
  const [presaleData, setPresaleData] = useState<PresaleData>(defaultPresaleData)
  const [isLoading, setIsLoading] = useState(false)
  const { account, isConnected } = useWallet()
  const { toast } = useToast()

  // Function to fetch Solana price and update state
  const fetchSolanaPrice = async () => {
    try {
      const priceData = await getSolanaPrice()
      setPresaleData((prev) => ({
        ...prev,
        solanaPrice: priceData,
        lastUpdated: new Date(),
      }))
    } catch (error) {
      console.error("Failed to fetch Solana price:", error)
    }
  }

  // Calculate token amount based on SOL input
  const calculateTokens = (solAmount: string): number => {
    if (!solAmount || !presaleData.solanaPrice) return 0

    const amount = Number.parseFloat(solAmount)
    if (isNaN(amount) || amount <= 0) return 0

    return calculateTokenAmount(amount, presaleData.solanaPrice.usd, presaleData.currentPrice)
  }

  // Check if the requested token amount is available
  const checkTokenAvailability = (tokenAmount: number): boolean => {
    return tokenAmount <= presaleData.remainingTokens
  }

  const refreshData = async () => {
    setIsLoading(true)
    try {
      await fetchSolanaPrice()
      // In a real implementation, you would also fetch presale stats from your database
    } catch (error) {
      console.error("Failed to refresh presale data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to set paused state
  const setPaused = (paused: boolean) => {
    // Update shared state
    updatePresaleState({ isPaused: paused })

    setPresaleData((prev) => ({
      ...prev,
      isPaused: paused,
    }))
  }

  // Function to set released state
  const setReleased = (released: boolean) => {
    console.log("Setting presale released state to:", released)

    // Update shared state
    updatePresaleState({
      isReleased: released,
      isPaused: !released, // When released, unpause automatically
    })

    setPresaleData((prev) => ({
      ...prev,
      isReleased: released,
      isPaused: !released, // When released, unpause automatically
    }))
  }

  // Function to record a purchase after it's been verified
  const recordPurchase = async (amount: string): Promise<any> => {
    if (!account) throw new Error("Wallet not connected")
    if (!presaleData.solanaPrice) throw new Error("Price data unavailable")

    // Check if presale is paused or not released
    if (presaleData.isPaused || !presaleData.isReleased) {
      throw new Error("Presale is not active")
    }

    try {
      setIsLoading(true)

      // Calculate token amount based on current SOL price
      const solAmount = Number.parseFloat(amount)
      const tokenAmount = calculateTokens(amount)

      // Check if there are enough tokens available
      if (!checkTokenAvailability(tokenAmount)) {
        throw new Error(
          `Purchase exceeds available tokens. Only ${presaleData.remainingTokens.toLocaleString()} MND tokens remaining.`,
        )
      }

      // Calculate USD value
      const usdValue = solAmount * presaleData.solanaPrice.usd

      // Update the presale data to reflect the purchase
      const newRaisedAmount = presaleData.raisedAmount + usdValue
      const newPercentageRaised = Math.min(100, (newRaisedAmount / presaleData.hardCap) * 100)
      const newTotalTokensSold = presaleData.totalTokensSold + tokenAmount
      const newRemainingTokens = PRESALE_ALLOCATION - newTotalTokensSold

      setPresaleData({
        ...presaleData,
        raisedAmount: newRaisedAmount,
        percentageRaised: Number.parseFloat(newPercentageRaised.toFixed(2)),
        totalTokensSold: newTotalTokensSold,
        remainingTokens: newRemainingTokens,
      })

      return { success: true }
    } catch (error) {
      console.error("Failed to record purchase:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Subscribe to shared state changes
  useEffect(() => {
    const unsubscribe = subscribeToPresaleState(() => {
      const state = getPresaleState()
      console.log("Presale state updated from shared service:", state)

      setPresaleData((prev) => ({
        ...prev,
        isPaused: state.isPaused,
        isReleased: state.isReleased,
      }))
    })

    return unsubscribe
  }, [])

  // Initial data load
  useEffect(() => {
    refreshData()

    // Set up interval to refresh price every 60 seconds
    const intervalId = setInterval(() => {
      fetchSolanaPrice()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  // Refresh data when wallet connection changes
  useEffect(() => {
    if (isConnected) {
      refreshData()
    }
  }, [isConnected])

  return (
    <PresaleContext.Provider
      value={{
        presaleData,
        recordPurchase,
        refreshData,
        calculateTokens,
        isLoading,
        checkTokenAvailability,
        setPaused,
        setReleased,
      }}
    >
      {children}
    </PresaleContext.Provider>
  )
}

export const usePresale = () => useContext(PresaleContext)

