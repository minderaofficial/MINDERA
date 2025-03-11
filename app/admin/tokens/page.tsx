"use client"

import { useState } from "react"
import { useAdmin } from "@/context/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Download } from "lucide-react"

export default function TokenDistribution() {
  const { adminState, distributeTokens, bulkDistributeTokens, isLoading } = useAdmin()
  const { toast } = useToast()
  const [singleWallet, setSingleWallet] = useState("")
  const [singleAmount, setSingleAmount] = useState("")
  const [bulkDistribution, setBulkDistribution] = useState("")

  const handleSingleDistribution = async () => {
    if (!singleWallet || !singleAmount) {
      toast({
        title: "Missing Information",
        description: "Please enter both wallet address and token amount.",
        variant: "destructive",
      })
      return
    }

    const amount = Number.parseFloat(singleAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid token amount.",
        variant: "destructive",
      })
      return
    }

    const success = await distributeTokens(singleWallet, amount)

    if (success) {
      toast({
        title: "Tokens Distributed",
        description: `${amount.toLocaleString()} MND tokens have been allocated to ${singleWallet.slice(0, 6)}...${singleWallet.slice(-4)}`,
      })
      setSingleWallet("")
      setSingleAmount("")
    } else {
      toast({
        title: "Distribution Failed",
        description: "Failed to distribute tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBulkDistribution = async () => {
    if (!bulkDistribution) {
      toast({
        title: "Missing Information",
        description: "Please enter wallet addresses and token amounts.",
        variant: "destructive",
      })
      return
    }

    try {
      // Parse bulk distribution text
      const lines = bulkDistribution.split("\n").filter((line) => line.trim())
      const distributions = lines.map((line) => {
        const [walletAddress, amountStr] = line.split(",").map((part) => part.trim())
        const amount = Number.parseFloat(amountStr)

        if (!walletAddress || isNaN(amount) || amount <= 0) {
          throw new Error(`Invalid line: ${line}`)
        }

        return { walletAddress, amount }
      })

      const success = await bulkDistributeTokens(distributions)

      if (success) {
        const totalAmount = distributions.reduce((sum, dist) => sum + dist.amount, 0)

        toast({
          title: "Bulk Distribution Complete",
          description: `${totalAmount.toLocaleString()} MND tokens have been allocated to ${distributions.length} wallet addresses.`,
        })
        setBulkDistribution("")
      } else {
        toast({
          title: "Distribution Failed",
          description: "Failed to process bulk distribution. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Invalid Format",
        description:
          "Please check your input format. Each line should contain a wallet address and amount separated by a comma.",
        variant: "destructive",
      })
    }
  }

  const handleExportDistributions = () => {
    // Create CSV content
    const headers = ["Wallet Address", "Amount", "Timestamp", "Transaction Hash"]
    const rows = adminState.distributions.map((dist) => [
      dist.walletAddress,
      dist.amount.toString(),
      dist.timestamp.toISOString(),
      dist.txHash || "",
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `token-distributions-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "Token distribution data has been exported to CSV.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Token Distribution</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
            onClick={handleExportDistributions}
            disabled={adminState.distributions.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button
            variant="outline"
            className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </div>
      </div>

      <Card className="border-purple-700/30 bg-black/50">
        <CardHeader>
          <CardTitle>Token Allocation Summary</CardTitle>
          <CardDescription>Overview of token distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Total Supply</h3>
              <p className="text-2xl font-bold">1,000,000,000 MND</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Allocated</h3>
              <p className="text-2xl font-bold">{adminState.totalDistributed.toLocaleString()} MND</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Remaining</h3>
              <p className="text-2xl font-bold">{(1000000000 - adminState.totalDistributed).toLocaleString()} MND</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Distributions</h3>
              <p className="text-2xl font-bold">{adminState.distributions.length}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Distribution Progress</h3>
            <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
                style={{ width: `${(adminState.totalDistributed / 1000000000) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {((adminState.totalDistributed / 1000000000) * 100).toFixed(2)}% of total supply distributed
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="single">Single Wallet</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Distribute to Single Wallet</CardTitle>
              <CardDescription>Allocate tokens to a specific wallet address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">Wallet Address</Label>
                  <Input
                    id="wallet-address"
                    placeholder="Enter Solana wallet address"
                    value={singleWallet}
                    onChange={(e) => setSingleWallet(e.target.value)}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token-amount">Token Amount</Label>
                  <Input
                    id="token-amount"
                    placeholder="Enter amount of MND tokens"
                    value={singleAmount}
                    onChange={(e) => setSingleAmount(e.target.value)}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  className="bg-purple-700 text-white hover:bg-purple-600 w-full"
                  onClick={handleSingleDistribution}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Distribute Tokens"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Bulk Distribution</CardTitle>
              <CardDescription>Distribute tokens to multiple wallets at once</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bulk-distribution">Wallet Addresses and Amounts</Label>
                  <Textarea
                    id="bulk-distribution"
                    placeholder="Enter one wallet address and amount per line, separated by comma:
Example:
946svTRVZa4KGU8NkvVSJwU9NkHdzr9Q5LFkhVHQUwdh, 10000
7XSvko..."
                    value={bulkDistribution}
                    onChange={(e) => setBulkDistribution(e.target.value)}
                    className="min-h-[200px] border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  className="bg-purple-700 text-white hover:bg-purple-600 w-full"
                  onClick={handleBulkDistribution}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process Bulk Distribution"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {adminState.distributions.length > 0 && (
        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader>
            <CardTitle>Recent Distributions</CardTitle>
            <CardDescription>Latest token allocations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-900/40">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Wallet</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Transaction</th>
                  </tr>
                </thead>
                <tbody>
                  {adminState.distributions.slice(0, 5).map((dist) => (
                    <tr key={dist.id} className="border-b border-purple-900/20">
                      <td className="py-3 px-4">{`${dist.walletAddress.slice(0, 6)}...${dist.walletAddress.slice(-4)}`}</td>
                      <td className="py-3 px-4">{dist.amount.toLocaleString()} MND</td>
                      <td className="py-3 px-4">{dist.timestamp.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {dist.txHash ? (
                          <a
                            href={`https://solscan.io/tx/${dist.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:underline"
                          >
                            {`${dist.txHash.slice(0, 6)}...${dist.txHash.slice(-4)}`}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

