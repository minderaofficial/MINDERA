"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { getPresaleState, updatePresaleState, subscribeToPresaleState } from "@/lib/presale-state"

// Types for our admin state
interface TokenDistribution {
  id: string
  walletAddress: string
  amount: number
  timestamp: Date
  txHash?: string
}

interface LiquidityPool {
  id: string
  name: string
  pair: string
  amount: number
  value: number
  locked: boolean
  lockEndDate?: Date
}

interface PresaleStage {
  id: number
  name: string
  price: number
  allocation: number
  sold: number
  active: boolean
}

interface Transaction {
  id: string
  wallet: string
  amount: string
  tokens: string
  timestamp: string
  status: "Completed" | "Pending" | "Failed"
  type: "Purchase" | "Distribution" | "Liquidity" | "Contract" | "Other"
}

interface AnalyticsData {
  dailySales: { date: string; amount: number }[]
  weeklySales: { week: string; amount: number }[]
  countrySales: { country: string; amount: number }[]
  deviceSales: { device: string; amount: number }[]
}

interface AdminSettings {
  minBuyIn: number
  maxBuyIn: number
  referralReward: number
  emergencyMode: boolean
  maintenanceMode: boolean
  whitelistOnly: boolean
  emailNotifications: boolean
  adminEmails: string[]
  ipRestrictions: boolean
  allowedIPs: string[]
}

// Add these types to the existing types section
interface TokenHolder {
  address: string
  balance: number
  name?: string
  frozen: boolean
  lastUpdated: Date
}

interface AdminState {
  // Presale stats
  totalRaised: number
  tokensSold: number
  uniqueWallets: number
  averagePurchase: number

  // Presale stages
  presaleActive: boolean
  currentStage: number
  stages: PresaleStage[]

  // Token distribution
  distributions: TokenDistribution[]
  totalDistributed: number

  // Contract
  contractDeployed: boolean
  contractAddress: string

  // Liquidity
  liquidityPools: LiquidityPool[]
  totalLiquidity: number

  // Daily stats for chart
  dailyStats: { name: string; amount: number }[]

  // Recent transactions
  recentTransactions: Transaction[]
  allTransactions: Transaction[]

  // Analytics
  analytics: AnalyticsData

  // Settings
  settings: AdminSettings

  // Presale release status
  presaleReleased: boolean

  // Add this to the AdminState interface
  tokenHolders: TokenHolder[]
  tokenPrice: number
}

interface AdminContextType {
  adminState: AdminState

  // Presale actions
  togglePresaleStatus: () => void
  advanceStage: () => void
  updateStageSettings: (stageId: number, settings: Partial<PresaleStage>) => void
  releasePresale: () => void // New function to release the presale

  // Token distribution actions
  distributeTokens: (walletAddress: string, amount: number) => Promise<boolean>
  bulkDistributeTokens: (distributions: { walletAddress: string; amount: number }[]) => Promise<boolean>

  // Contract actions
  deployContract: (settings: any) => Promise<boolean>

  // Liquidity actions
  addLiquidity: (pool: string, amount: number, lockDays?: number) => Promise<boolean>
  removeLiquidity: (poolId: string) => Promise<boolean>
  emergencyUnlockLiquidity: (password: string) => Promise<boolean>

  // Transaction actions
  searchTransactions: (query: string) => Transaction[]
  filterTransactions: (filters: { type?: string; status?: string; dateFrom?: Date; dateTo?: Date }) => Transaction[]

  // Settings actions
  updateSettings: (settings: Partial<AdminSettings>) => void

  // Loading states
  isLoading: boolean

  // Add these to the AdminContextType interface
  updateHolder: (address: string, updates: Partial<TokenHolder>) => void
  removeTokens: (address: string, amount: number) => Promise<boolean>
  freezeTokens: (address: string) => Promise<boolean>
  unfreezeTokens: (address: string) => Promise<boolean>
  addHolderName: (address: string, name: string) => Promise<boolean>
  clearAllHolders: () => Promise<boolean>
}

// Get initial state from shared service
const sharedState = getPresaleState()

// Initial analytics data
const initialAnalytics: AnalyticsData = {
  dailySales: [
    { date: "Mon", amount: 0 },
    { date: "Tue", amount: 0 },
    { date: "Wed", amount: 0 },
    { date: "Thu", amount: 0 },
    { date: "Fri", amount: 0 },
    { date: "Sat", amount: 0 },
    { date: "Sun", amount: 0 },
  ],
  weeklySales: [
    { week: "Week 1", amount: 0 },
    { week: "Week 2", amount: 0 },
    { week: "Week 3", amount: 0 },
    { week: "Week 4", amount: 0 },
  ],
  countrySales: [
    { country: "United States", amount: 0 },
    { country: "United Kingdom", amount: 0 },
    { country: "Germany", amount: 0 },
    { country: "Japan", amount: 0 },
    { country: "Canada", amount: 0 },
    { country: "Australia", amount: 0 },
    { country: "Other", amount: 0 },
  ],
  deviceSales: [
    { device: "Desktop", amount: 0 },
    { device: "Mobile", amount: 0 },
    { device: "Tablet", amount: 0 },
  ],
}

// Initial settings
const initialSettings: AdminSettings = {
  minBuyIn: 0.04,
  maxBuyIn: 10,
  referralReward: 5, // 5%
  emergencyMode: false,
  maintenanceMode: false,
  whitelistOnly: false,
  emailNotifications: true,
  adminEmails: ["admin@minderaai.com"],
  ipRestrictions: false,
  allowedIPs: [],
}

// Initial state
const initialState: AdminState = {
  totalRaised: 0, // Reset to 0
  tokensSold: 0, // Reset to 0
  uniqueWallets: 0, // Reset to 0
  averagePurchase: 0, // Reset to 0

  presaleActive: !sharedState.isPaused, // Use shared state
  currentStage: 1,
  stages: [
    { id: 1, name: "Stage 1", price: 0.0025, allocation: 100000000, sold: 0, active: true },
    { id: 2, name: "Stage 2", price: 0.0035, allocation: 100000000, sold: 0, active: false },
    { id: 3, name: "Stage 3", price: 0.005, allocation: 100000000, sold: 0, active: false },
  ],

  distributions: [],
  totalDistributed: 0,

  contractDeployed: false,
  contractAddress: "",

  liquidityPools: [],
  totalLiquidity: 0,

  dailyStats: [
    { name: "Day 1", amount: 0 },
    { name: "Day 2", amount: 0 },
    { name: "Day 3", amount: 0 },
    { name: "Day 4", amount: 0 },
    { name: "Day 5", amount: 0 },
    { name: "Day 6", amount: 0 },
    { name: "Day 7", amount: 0 },
  ],

  recentTransactions: [],
  allTransactions: [],

  analytics: initialAnalytics,

  settings: initialSettings,
  presaleReleased: sharedState.isReleased, // Use shared state

  // Add this to the initialState object
  tokenHolders: [
    {
      address: "946svTRVZa4KGU8NkvVSJwU9NkHdzr9Q5LFkhVHQUwdh",
      balance: 10000000,
      name: "Treasury",
      frozen: false,
      lastUpdated: new Date(),
    },
    {
      address: "7XSvkoFhPKj8BmwbBnZNdU5PBNrGN8jS3DQMx5urYFPs",
      balance: 5000000,
      name: "Marketing Wallet",
      frozen: false,
      lastUpdated: new Date(),
    },
    {
      address: "3Gskj6iKvwCmvpY9hZNKgpmQHQCVKKZHxKMerGskNYgU",
      balance: 2500000,
      frozen: false,
      lastUpdated: new Date(),
    },
    {
      address: "8JzMCrKAMmCVyX2iAL2XUVDRyRXmZ5LjGZxiKvkz9VQU",
      balance: 1000000,
      frozen: true,
      lastUpdated: new Date(),
    },
    {
      address: "5KL6JLGAXZxmBbBDQki8Pqm4XQ7i4iuUUQNwEwgzNJkV",
      balance: 750000,
      name: "Early Investor 1",
      frozen: false,
      lastUpdated: new Date(),
    },
    {
      address: "2ZwxAHVA9hNbibRvs9HcMYjGXKVcvBxxzBmuoXgKAhGm",
      balance: 500000,
      name: "Early Investor 2",
      frozen: false,
      lastUpdated: new Date(),
    },
    {
      address: "9qLmKA3PVm76TBxLmvxGLQQbF8EYBDm4KH5F3FVS3vJZ",
      balance: 250000,
      frozen: false,
      lastUpdated: new Date(),
    },
    {
      address: "4RnR9vQE5ajUdKW4KHKjKvJP9FJGQy6HVVyTQXuxVbdH",
      balance: 100000,
      frozen: false,
      lastUpdated: new Date(),
    },
    {
      address: "6YQRPz9SYaJ5sBUcwmM2aEkVhyFZWAaZz8XwVSdPHxcQ",
      balance: 50000,
      frozen: false,
      lastUpdated: new Date(),
    },
    {
      address: "1LmKA3PVm76TBxLmvxGLQQbF8EYBDm4KH5F3FVS3vJZ",
      balance: 25000,
      frozen: false,
      lastUpdated: new Date(),
    },
  ],
  tokenPrice: 0.05, // $0.05 per MND token
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminState, setAdminState] = useState<AdminState>({
    ...initialState,
    allTransactions: [], // Start with empty transactions
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Toggle presale status (active/paused)
  const togglePresaleStatus = () => {
    setAdminState((prev) => {
      const newPresaleActive = !prev.presaleActive

      // Update shared state
      updatePresaleState({ isPaused: !newPresaleActive })

      return {
        ...prev,
        presaleActive: newPresaleActive,
      }
    })
  }

  // Release presale
  const releasePresale = () => {
    console.log("Admin: Releasing presale")

    // Update shared state directly
    updatePresaleState({
      isReleased: true,
      isPaused: false,
    })

    setAdminState((prev) => {
      return {
        ...prev,
        presaleReleased: true,
        presaleActive: true, // Also activate the presale
      }
    })

    toast({
      title: "Presale Released",
      description: "The presale has been released and is now active.",
    })
  }

  // Advance to next presale stage
  const advanceStage = () => {
    if (adminState.currentStage >= 3) return

    const nextStage = adminState.currentStage + 1

    setAdminState((prev) => {
      const updatedStages = prev.stages.map((stage) => {
        if (stage.id === prev.currentStage) {
          return { ...stage, active: false }
        }
        if (stage.id === nextStage) {
          return { ...stage, active: true }
        }
        return stage
      })

      return {
        ...prev,
        currentStage: nextStage,
        stages: updatedStages,
      }
    })
  }

  // Update stage settings
  const updateStageSettings = (stageId: number, settings: Partial<PresaleStage>) => {
    setAdminState((prev) => {
      const updatedStages = prev.stages.map((stage) => {
        if (stage.id === stageId) {
          return { ...stage, ...settings }
        }
        return stage
      })

      return {
        ...prev,
        stages: updatedStages,
      }
    })
  }

  // Distribute tokens to a single wallet
  const distributeTokens = async (walletAddress: string, amount: number): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newDistribution: TokenDistribution = {
        id: `dist-${Date.now()}`,
        walletAddress,
        amount,
        timestamp: new Date(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      }

      const newTransaction: Transaction = {
        id: `tx-${Date.now()}`,
        wallet: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        amount: "Admin",
        tokens: `${amount.toLocaleString()} MND`,
        timestamp: new Date().toISOString(),
        status: "Completed",
        type: "Distribution",
      }

      setAdminState((prev) => {
        // Update token holders list
        const updatedHolders = [...prev.tokenHolders]
        const existingHolderIndex = updatedHolders.findIndex(
          (holder) => holder.address.toLowerCase() === walletAddress.toLowerCase(),
        )

        if (existingHolderIndex >= 0) {
          // Update existing holder
          updatedHolders[existingHolderIndex] = {
            ...updatedHolders[existingHolderIndex],
            balance: updatedHolders[existingHolderIndex].balance + amount,
            lastUpdated: new Date(),
          }
        } else {
          // Add new holder
          updatedHolders.push({
            address: walletAddress,
            balance: amount,
            frozen: false,
            lastUpdated: new Date(),
          })
        }

        return {
          ...prev,
          distributions: [newDistribution, ...prev.distributions],
          totalDistributed: prev.totalDistributed + amount,
          recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 20),
          allTransactions: [newTransaction, ...prev.allTransactions],
          tokenHolders: updatedHolders,
        }
      })

      return true
    } catch (error) {
      console.error("Error distributing tokens:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Bulk distribute tokens
  const bulkDistributeTokens = async (distributions: { walletAddress: string; amount: number }[]): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newDistributions: TokenDistribution[] = distributions.map((dist) => ({
        id: `dist-${Date.now()}-${Math.random().toString(16).substr(2, 8)}`,
        walletAddress: dist.walletAddress,
        amount: dist.amount,
        timestamp: new Date(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      }))

      const totalAmount = distributions.reduce((sum, dist) => sum + dist.amount, 0)

      const newTransaction: Transaction = {
        id: `bulk-${Date.now()}`,
        wallet: `Multiple (${distributions.length})`,
        amount: "Admin",
        tokens: `${totalAmount.toLocaleString()} MND`,
        timestamp: new Date().toISOString(),
        status: "Completed",
        type: "Distribution",
      }

      setAdminState((prev) => {
        // Update token holders list
        const updatedHolders = [...prev.tokenHolders]

        // Process each distribution to update or add token holders
        distributions.forEach((dist) => {
          const existingHolderIndex = updatedHolders.findIndex(
            (holder) => holder.address.toLowerCase() === dist.walletAddress.toLowerCase(),
          )

          if (existingHolderIndex >= 0) {
            // Update existing holder
            updatedHolders[existingHolderIndex] = {
              ...updatedHolders[existingHolderIndex],
              balance: updatedHolders[existingHolderIndex].balance + dist.amount,
              lastUpdated: new Date(),
            }
          } else {
            // Add new holder
            updatedHolders.push({
              address: dist.walletAddress,
              balance: dist.amount,
              frozen: false,
              lastUpdated: new Date(),
            })
          }
        })

        return {
          ...prev,
          distributions: [...newDistributions, ...prev.distributions],
          totalDistributed: prev.totalDistributed + totalAmount,
          recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 20),
          allTransactions: [newTransaction, ...prev.allTransactions],
          tokenHolders: updatedHolders,
        }
      })

      return true
    } catch (error) {
      console.error("Error bulk distributing tokens:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Deploy contract
  const deployContract = async (settings: any): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const contractAddress = "MNDxyz123456789abcdef123456789abcdef123456"

      const newTransaction: Transaction = {
        id: `contract-${Date.now()}`,
        wallet: "Admin",
        amount: "N/A",
        tokens: `${settings.initialSupply.toLocaleString()} MND`,
        timestamp: new Date().toISOString(),
        status: "Completed",
        type: "Contract",
      }

      setAdminState((prev) => ({
        ...prev,
        contractDeployed: true,
        contractAddress,
        recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 20),
        allTransactions: [newTransaction, ...prev.allTransactions],
      }))

      return true
    } catch (error) {
      console.error("Error deploying contract:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Add liquidity
  const addLiquidity = async (pool: string, amount: number, lockDays = 0): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newPool: LiquidityPool = {
        id: `pool-${Date.now()}`,
        name: pool,
        pair: pool.replace("/", "-"),
        amount,
        value: amount * 0.05, // Simplified calculation
        locked: lockDays > 0,
        lockEndDate: lockDays > 0 ? new Date(Date.now() + lockDays * 24 * 60 * 60 * 1000) : undefined,
      }

      const newTransaction: Transaction = {
        id: `liquidity-${Date.now()}`,
        wallet: "Admin",
        amount: `${amount.toLocaleString()} MND`,
        tokens: `Added to ${pool}`,
        timestamp: new Date().toISOString(),
        status: "Completed",
        type: "Liquidity",
      }

      setAdminState((prev) => {
        // Check if pool already exists
        const existingPoolIndex = prev.liquidityPools.findIndex((p) => p.name === pool)

        let updatedPools
        if (existingPoolIndex >= 0) {
          // Update existing pool
          updatedPools = [...prev.liquidityPools]
          updatedPools[existingPoolIndex] = {
            ...updatedPools[existingPoolIndex],
            amount: updatedPools[existingPoolIndex].amount + amount,
            value: updatedPools[existingPoolIndex].value + amount * 0.05,
          }
        } else {
          // Add new pool
          updatedPools = [...prev.liquidityPools, newPool]
        }

        return {
          ...prev,
          liquidityPools: updatedPools,
          totalLiquidity: prev.totalLiquidity + amount * 0.05,
          recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 20),
          allTransactions: [newTransaction, ...prev.allTransactions],
        }
      })

      return true
    } catch (error) {
      console.error("Error adding liquidity:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Remove liquidity
  const removeLiquidity = async (poolId: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const pool = adminState.liquidityPools.find((p) => p.id === poolId)

      if (!pool) return false

      const newTransaction: Transaction = {
        id: `liquidity-${Date.now()}`,
        wallet: "Admin",
        amount: `${pool.amount.toLocaleString()} MND`,
        tokens: `Removed from ${pool.name}`,
        timestamp: new Date().toISOString(),
        status: "Completed",
        type: "Liquidity",
      }

      setAdminState((prev) => {
        const poolToRemove = prev.liquidityPools.find((p) => p.id === poolId)

        if (!poolToRemove) return prev

        return {
          ...prev,
          liquidityPools: prev.liquidityPools.filter((p) => p.id !== poolId),
          totalLiquidity: prev.totalLiquidity - poolToRemove.value,
          recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 20),
          allTransactions: [newTransaction, ...prev.allTransactions],
        }
      })

      return true
    } catch (error) {
      console.error("Error removing liquidity:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Emergency unlock all liquidity
  const emergencyUnlockLiquidity = async (password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Check password (in a real app, this would be a secure check)
      // For demo purposes, we'll hardcode the password
      if (password !== "AAmi220773!mindera") {
        throw new Error("Invalid emergency password")
      }

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newTransaction: Transaction = {
        id: `emergency-${Date.now()}`,
        wallet: "Admin",
        amount: "EMERGENCY",
        tokens: "All Pools Unlocked",
        timestamp: new Date().toISOString(),
        status: "Completed",
        type: "Liquidity",
      }

      setAdminState((prev) => {
        const updatedPools = prev.liquidityPools.map((pool) => ({
          ...pool,
          locked: false,
          lockEndDate: undefined,
        }))

        return {
          ...prev,
          liquidityPools: updatedPools,
          recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 20),
          allTransactions: [newTransaction, ...prev.allTransactions],
          settings: {
            ...prev.settings,
            emergencyMode: true,
          },
        }
      })

      return true
    } catch (err: any) {
      console.error("Error unlocking liquidity:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Search transactions
  const searchTransactions = (query: string): Transaction[] => {
    if (!query) return adminState.allTransactions.slice(0, 20)

    const lowerQuery = query.toLowerCase()
    return adminState.allTransactions
      .filter(
        (tx) =>
          tx.wallet.toLowerCase().includes(lowerQuery) ||
          tx.tokens.toLowerCase().includes(lowerQuery) ||
          tx.id.toLowerCase().includes(lowerQuery),
      )
      .slice(0, 20)
  }

  // Filter transactions
  const filterTransactions = (filters: {
    type?: string
    status?: string
    dateFrom?: Date
    dateTo?: Date
  }): Transaction[] => {
    return adminState.allTransactions
      .filter((tx) => {
        // Filter by type
        if (filters.type && filters.type !== "All" && tx.type !== filters.type) {
          return false
        }

        // Filter by status
        if (filters.status && filters.status !== "All" && tx.status !== filters.status) {
          return false
        }

        // Filter by date range
        if (filters.dateFrom || filters.dateTo) {
          const txDate = new Date(tx.timestamp)

          if (filters.dateFrom && txDate < filters.dateFrom) {
            return false
          }

          if (filters.dateTo) {
            // Set time to end of day for the to date
            const endDate = new Date(filters.dateTo)
            endDate.setHours(23, 59, 59, 999)

            if (txDate > endDate) {
              return false
            }
          }
        }

        return true
      })
      .slice(0, 100) // Limit to 100 results
  }

  // Update settings
  const updateSettings = (settings: Partial<AdminSettings>) => {
    setAdminState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...settings,
      },
    }))
  }

  // Subscribe to shared state changes
  useEffect(() => {
    const unsubscribe = subscribeToPresaleState(() => {
      const state = getPresaleState()
      console.log("Admin: Presale state updated from shared service:", state)

      setAdminState((prev) => ({
        ...prev,
        presaleActive: !state.isPaused,
        presaleReleased: state.isReleased,
      }))
    })

    return unsubscribe
  }, [])

  // Load initial data
  useEffect(() => {
    // In a real app, you would fetch data from your API here
  }, [])

  // Add these functions to the AdminProvider component, before the return statement

  // Update a token holder's information
  const updateHolder = (address: string, updates: Partial<TokenHolder>) => {
    setAdminState((prev) => {
      const updatedHolders = prev.tokenHolders.map((holder) => {
        if (holder.address === address) {
          return {
            ...holder,
            ...updates,
            lastUpdated: new Date(),
          }
        }
        return holder
      })

      return {
        ...prev,
        tokenHolders: updatedHolders,
      }
    })
  }

  // Remove tokens from a holder
  const removeTokens = async (address: string, amount: number): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setAdminState((prev) => {
        const holder = prev.tokenHolders.find((h) => h.address === address)

        if (!holder || holder.balance < amount) {
          throw new Error("Cannot remove more tokens than the holder has")
        }

        const updatedHolders = prev.tokenHolders.map((h) => {
          if (h.address === address) {
            return {
              ...h,
              balance: h.balance - amount,
              lastUpdated: new Date(),
            }
          }
          return h
        })

        const newTransaction: Transaction = {
          id: `token-removal-${Date.now()}`,
          wallet: address.slice(0, 6) + "..." + address.slice(-4),
          amount: `${amount.toLocaleString()} MND`,
          tokens: "Removed",
          timestamp: new Date().toISOString(),
          status: "Completed",
          type: "Other",
        }

        return {
          ...prev,
          tokenHolders: updatedHolders,
          recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 20),
          allTransactions: [newTransaction, ...prev.allTransactions],
        }
      })

      return true
    } catch (error) {
      console.error("Error removing tokens:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Freeze a holder's tokens
  const freezeTokens = async (address: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setAdminState((prev) => {
        const updatedHolders = prev.tokenHolders.map((h) => {
          if (h.address === address) {
            return {
              ...h,
              frozen: true,
              lastUpdated: new Date(),
            }
          }
          return h
        })

        const newTransaction: Transaction = {
          id: `token-freeze-${Date.now()}`,
          wallet: address.slice(0, 6) + "..." + address.slice(-4),
          amount: "N/A",
          tokens: "Frozen",
          timestamp: new Date().toISOString(),
          status: "Completed",
          type: "Other",
        }

        return {
          ...prev,
          tokenHolders: updatedHolders,
          recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 20),
          allTransactions: [newTransaction, ...prev.allTransactions],
        }
      })

      return true
    } catch (error) {
      console.error("Error freezing tokens:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Unfreeze a holder's tokens
  const unfreezeTokens = async (address: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setAdminState((prev) => {
        const updatedHolders = prev.tokenHolders.map((h) => {
          if (h.address === address) {
            return {
              ...h,
              frozen: false,
              lastUpdated: new Date(),
            }
          }
          return h
        })

        const newTransaction: Transaction = {
          id: `token-unfreeze-${Date.now()}`,
          wallet: address.slice(0, 6) + "..." + address.slice(-4),
          amount: "N/A",
          tokens: "Unfrozen",
          timestamp: new Date().toISOString(),
          status: "Completed",
          type: "Other",
        }

        return {
          ...prev,
          tokenHolders: updatedHolders,
          recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 20),
          allTransactions: [newTransaction, ...prev.allTransactions],
        }
      })

      return true
    } catch (error) {
      console.error("Error unfreezing tokens:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Add a name to a holder
  const addHolderName = async (address: string, name: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      setAdminState((prev) => {
        const updatedHolders = prev.tokenHolders.map((h) => {
          if (h.address === address) {
            return {
              ...h,
              name,
              lastUpdated: new Date(),
            }
          }
          return h
        })

        return {
          ...prev,
          tokenHolders: updatedHolders,
        }
      })

      return true
    } catch (error) {
      console.error("Error adding holder name:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Add this function to the AdminProvider component, before the return statement
  // Clear all token holders
  const clearAllHolders = async (): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setAdminState((prev) => {
        const newTransaction: Transaction = {
          id: `clear-holders-${Date.now()}`,
          wallet: "Admin",
          amount: "ALL",
          tokens: "Holders Removed",
          timestamp: new Date().toISOString(),
          status: "Completed",
          type: "Other",
        }

        return {
          ...prev,
          tokenHolders: [],
          recentTransactions: [newTransaction, ...prev.recentTransactions].slice(0, 20),
          allTransactions: [newTransaction, ...prev.allTransactions],
        }
      })

      return true
    } catch (error) {
      console.error("Error clearing token holders:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminContext.Provider
      value={{
        adminState,
        togglePresaleStatus,
        advanceStage,
        updateStageSettings,
        releasePresale,
        distributeTokens,
        bulkDistributeTokens,
        deployContract,
        addLiquidity,
        removeLiquidity,
        emergencyUnlockLiquidity,
        searchTransactions,
        filterTransactions,
        updateSettings,
        isLoading,
        // Add these functions to the context value in the return statement
        updateHolder,
        removeTokens,
        freezeTokens,
        unfreezeTokens,
        addHolderName,
        clearAllHolders,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}

