"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ethers } from "ethers"

// This would be your actual presale contract address and ABI
const PRESALE_CONTRACT_ADDRESS = "0x..."
const PRESALE_CONTRACT_ABI = [
  // Your contract ABI here
]

export function PresaleForm({ account }: { account: string | null }) {
  const [amount, setAmount] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Calculate token amount based on current price
  const tokenAmount = amount ? Number.parseFloat(amount) / 0.0025 : 0

  const handlePurchase = async () => {
    if (!account) {
      setError("Please connect your wallet first")
      return
    }

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(PRESALE_CONTRACT_ADDRESS, PRESALE_CONTRACT_ABI, signer)

      // Convert amount to wei (assuming ETH payment)
      const weiAmount = ethers.parseEther(amount)

      // Call your presale contract's purchase function
      const tx = await contract.buyTokens({ value: weiAmount })
      await tx.wait()

      setSuccess(`Successfully purchased ${tokenAmount.toLocaleString()} MIND tokens!`)
      setAmount("")
    } catch (err: any) {
      console.error("Error purchasing tokens:", err)
      setError(err.message || "Failed to purchase tokens")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="amount" className="text-sm">
          Purchase Amount (ETH)
        </label>
        <div className="relative">
          <input
            id="amount"
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-purple-700/30 bg-black/50 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            = {tokenAmount.toLocaleString()} MIND
          </div>
        </div>
      </div>

      <Button
        className="w-full bg-purple-700 text-white hover:bg-purple-600"
        onClick={handlePurchase}
        disabled={loading || !account}
      >
        {loading ? "Processing..." : "Buy MIND Tokens"}
      </Button>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      {!account && (
        <p className="text-xs text-center text-gray-400">Please connect your wallet to participate in the presale</p>
      )}

      <p className="text-xs text-center text-gray-400">
        By purchasing tokens you agree to our{" "}
        <a href="#" className="text-purple-400 hover:underline">
          Terms & Conditions
        </a>
      </p>
    </div>
  )
}

