"use client"

import type React from "react"

import { useState } from "react"
import { useAdmin } from "@/context/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertTriangle, Upload, Check } from "lucide-react"
import Link from "next/link"

export default function AirdropPage() {
  const { adminState, bulkDistributeTokens } = useAdmin()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [airdropAddresses, setAirdropAddresses] = useState("")
  const [fixedAmount, setFixedAmount] = useState("")
  const [useFixedAmount, setUseFixedAmount] = useState(true)
  const [successCount, setSuccessCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  const [showResults, setShowResults] = useState(false)

  // Parse addresses from textarea
  const parseAddresses = () => {
    const lines = airdropAddresses.split("\n").filter((line) => line.trim())

    if (useFixedAmount) {
      // Format: address per line, all get the same amount
      const amount = Number.parseFloat(fixedAmount)
      if (isNaN(amount) || amount <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid token amount",
          variant: "destructive",
        })
        return null
      }

      return lines.map((line) => {
        const address = line.trim()
        return { walletAddress: address, amount }
      })
    } else {
      // Format: address,amount per line
      return lines
        .map((line) => {
          const [address, amountStr] = line.split(",").map((part) => part.trim())
          const amount = Number.parseFloat(amountStr)

          if (!address || isNaN(amount) || amount <= 0) {
            return null
          }

          return { walletAddress: address, amount }
        })
        .filter((item) => item !== null)
    }
  }

  // Handle airdrop
  const handleAirdrop = async () => {
    const distributions = parseAddresses()

    if (!distributions || distributions.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please check your input format and try again",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setShowResults(false)
    setSuccessCount(0)
    setFailedCount(0)

    try {
      const success = await bulkDistributeTokens(distributions)

      if (success) {
        setSuccessCount(distributions.length)
        setShowResults(true)

        // Count new vs updated holders
        const newHolders = distributions.filter(
          (dist) =>
            !adminState.tokenHolders.some(
              (holder) => holder.address.toLowerCase() === dist.walletAddress.toLowerCase(),
            ),
        ).length

        const updatedHolders = distributions.length - newHolders

        const totalAmount = distributions.reduce((sum, dist) => sum + dist.amount, 0)

        toast({
          title: "Airdrop Successful",
          description: `Successfully airdropped ${totalAmount.toLocaleString()} MND tokens to ${distributions.length} addresses (${newHolders} new holders, ${updatedHolders} existing holders updated)`,
        })

        // Clear the form
        if (useFixedAmount) {
          setAirdropAddresses("")
        }
      } else {
        setFailedCount(distributions.length)
        setShowResults(true)
        toast({
          title: "Airdrop Failed",
          description: "Failed to process airdrop. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error processing airdrop:", error)
      setFailedCount(distributions.length)
      setShowResults(true)
      toast({
        title: "Error",
        description: "An error occurred while processing the airdrop",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setAirdropAddresses(content)
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Token Airdrop</h1>
        <Button
          variant="outline"
          className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>

      <Card className="border-purple-700/30 bg-black/50">
        <CardHeader>
          <CardTitle>Airdrop Tokens</CardTitle>
          <CardDescription>Distribute tokens to multiple addresses at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="fixed-amount"
                checked={useFixedAmount}
                onChange={() => setUseFixedAmount(true)}
                className="text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor="fixed-amount">Fixed Amount Per Address</Label>

              <input
                type="radio"
                id="variable-amount"
                checked={!useFixedAmount}
                onChange={() => setUseFixedAmount(false)}
                className="ml-4 text-purple-600 focus:ring-purple-500"
              />
              <Label htmlFor="variable-amount">Variable Amounts</Label>
            </div>

            {useFixedAmount && (
              <div className="space-y-2">
                <Label htmlFor="token-amount">Token Amount (MND)</Label>
                <Input
                  id="token-amount"
                  type="number"
                  placeholder="Enter amount of MND tokens per address"
                  value={fixedAmount}
                  onChange={(e) => setFixedAmount(e.target.value)}
                  className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="addresses">
                  {useFixedAmount
                    ? "Wallet Addresses (one per line)"
                    : "Addresses and Amounts (address,amount per line)"}
                </Label>
                <label className="cursor-pointer text-sm text-purple-400 hover:text-purple-300">
                  <input type="file" accept=".txt,.csv" onChange={handleFileUpload} className="hidden" />
                  <Upload className="h-4 w-4 inline mr-1" />
                  Upload File
                </label>
              </div>
              <Textarea
                id="addresses"
                placeholder={
                  useFixedAmount
                    ? "Enter one wallet address per line"
                    : "Format: address,amount\nExample:\n0x1234...5678,1000\n0xabcd...efgh,500"
                }
                value={airdropAddresses}
                onChange={(e) => setAirdropAddresses(e.target.value)}
                className="min-h-[200px] border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-400">
                {useFixedAmount
                  ? "Enter one wallet address per line. Each address will receive the same amount of tokens."
                  : "Enter one address and amount pair per line, separated by a comma."}
              </p>
            </div>

            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-400">Important</p>
                  <p className="text-sm text-yellow-300/80 mt-1">
                    This action will distribute tokens to all addresses in the list. Please double-check all addresses
                    before proceeding. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            {showResults && (
              <div
                className={`p-4 rounded-lg ${
                  failedCount > 0
                    ? "bg-red-900/20 border border-red-500/30"
                    : "bg-green-900/20 border border-green-500/30"
                }`}
              >
                <div className="flex items-start gap-2">
                  {failedCount > 0 ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium ${failedCount > 0 ? "text-red-400" : "text-green-400"}`}>
                      Airdrop Results
                    </p>
                    <p className="text-sm mt-1">
                      {successCount > 0 && (
                        <span className="text-green-400">Successfully sent to {successCount} addresses. </span>
                      )}
                      {failedCount > 0 && (
                        <span className="text-red-400">Failed to send to {failedCount} addresses.</span>
                      )}
                    </p>
                    <p className="text-sm mt-1 text-gray-400">
                      Token holders list has been updated. You can view the updated list in the Token Holders section.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {showResults && successCount > 0 && (
              <div className="mt-2 text-center">
                <Link href="/admin/holders" className="text-purple-400 hover:text-purple-300 underline text-sm">
                  View updated token holders
                </Link>
              </div>
            )}

            <Button
              className="w-full bg-purple-700 text-white hover:bg-purple-600"
              onClick={handleAirdrop}
              disabled={
                isLoading ||
                !airdropAddresses.trim() ||
                (useFixedAmount && (!fixedAmount || Number.parseFloat(fixedAmount) <= 0))
              }
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Airdrop...
                </>
              ) : (
                "Start Airdrop"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-700/30 bg-black/50">
        <CardHeader>
          <CardTitle>Airdrop History</CardTitle>
          <CardDescription>Recent token distributions</CardDescription>
        </CardHeader>
        <CardContent>
          {adminState.distributions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-900/40">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Recipients</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Total Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {adminState.distributions.slice(0, 5).map((dist, index) => (
                    <tr key={dist.id} className="border-b border-purple-900/20">
                      <td className="py-3 px-4">{dist.timestamp.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {dist.walletAddress.slice(0, 6)}...{dist.walletAddress.slice(-4)}
                      </td>
                      <td className="py-3 px-4">{dist.amount.toLocaleString()} MND</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-6 text-gray-400">No airdrop history found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

