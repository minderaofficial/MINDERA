"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"

// Define the Solana wallet interface based on Phantom/Solflare API
interface SolanaWallet {
  isPhantom?: boolean
  isSolflare?: boolean
  publicKey: { toString: () => string } | null
  isConnected: boolean
  connect: () => Promise<{ publicKey: { toString: () => string } }>
  disconnect: () => Promise<void>
  signAndSendTransaction?: (transaction: any) => Promise<{ signature: string }>
  request?: (params: any) => Promise<any>
}

interface WalletContextType {
  account: string | null
  provider: any | null
  isConnected: boolean
  isConnecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType>({
  account: null,
  provider: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [provider, setProvider] = useState<SolanaWallet | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  // Check if Solana wallet is available in the browser
  const getSolanaWallet = (): SolanaWallet | null => {
    if (typeof window === "undefined") return null

    // Check for Phantom wallet
    if (window.phantom?.solana) {
      return window.phantom.solana
    }

    // Check for Solflare wallet
    if (window.solflare) {
      return window.solflare
    }

    // Check for generic solana object (might be provided by other wallets)
    if (window.solana) {
      return window.solana
    }

    return null
  }

  const connect = async () => {
    if (typeof window === "undefined") {
      throw new Error("Cannot connect wallet in server environment")
    }

    setIsConnecting(true)

    try {
      const wallet = getSolanaWallet()

      if (!wallet) {
        throw new Error("No Solana wallet found. Please install Phantom or Solflare extension")
      }

      // Connect to the wallet
      const { publicKey } = await wallet.connect()
      const publicKeyString = publicKey.toString()

      setAccount(publicKeyString)
      setProvider(wallet)

      toast({
        title: "Wallet Connected",
        description: "Your Solana wallet has been connected successfully.",
      })
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect Solana wallet",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    if (provider) {
      provider.disconnect().then(() => {
        setAccount(null)
        setProvider(null)
        toast({
          title: "Wallet Disconnected",
          description: "Your Solana wallet has been disconnected.",
        })
      })
    }
  }

  // Function to send SOL to a recipient
  const sendSol = async (amount: string, recipient: string): Promise<string> => {
    if (!provider || !account) {
      throw new Error("Wallet not connected")
    }

    try {
      // For Phantom wallet
      if (provider.isPhantom && provider.request) {
        const response = await provider.request({
          method: "connect",
        })

        // Use Phantom's transfer method
        const result = await provider.request({
          method: "transfer",
          params: {
            to: recipient,
            amount: Number.parseFloat(amount) * 1e9, // Convert SOL to lamports
          },
        })

        return result.signature
      }
      // For Solflare and other wallets
      else {
        // Try a more generic approach
        // This will open a popup to the wallet's send page
        window.open(`https://solscan.io/tx/send?recipient=${recipient}&amount=${amount}`, "_blank")

        // Return a placeholder since we can't get the actual signature
        return "manual-transaction"
      }
    } catch (error: any) {
      console.error("Failed to send SOL:", error)
      throw error
    }
  }

  // Check for wallet on initial load
  useEffect(() => {
    const wallet = getSolanaWallet()
    if (wallet && wallet.isConnected && wallet.publicKey) {
      setAccount(wallet.publicKey.toString())
      setProvider(wallet)
    }
  }, [])

  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        isConnected: !!account,
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)

// Add TypeScript definitions for window
declare global {
  interface Window {
    solana?: SolanaWallet
    phantom?: {
      solana?: SolanaWallet
    }
    solflare?: SolanaWallet
  }
}

