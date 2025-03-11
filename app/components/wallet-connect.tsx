"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ethers } from "ethers"

export function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectWallet = async () => {
    setLoading(true)
    setError(null)

    try {
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed")
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send("eth_requestAccounts", [])

      if (accounts.length > 0) {
        setAccount(accounts[0])
      } else {
        throw new Error("No accounts found")
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      setError(err.message || "Failed to connect wallet")
    } finally {
      setLoading(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
  }

  return (
    <div>
      {account ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
          <Button
            variant="outline"
            className="border-purple-700 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
            onClick={disconnectWallet}
          >
            Disconnect Wallet
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          className="border-purple-700 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
          onClick={connectWallet}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}

