"use client"

import { useState } from "react"
import { useAdmin } from "@/context/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Copy, ExternalLink, CheckCircle } from "lucide-react"

export default function ContractManagement() {
  const { adminState, deployContract, isLoading } = useAdmin()
  const { toast } = useToast()
  const [tokenName, setTokenName] = useState("Mindera AI")
  const [tokenSymbol, setTokenSymbol] = useState("MND")
  const [tokenDecimals, setTokenDecimals] = useState("9")
  const [initialSupply, setInitialSupply] = useState("1000000000")
  const [copied, setCopied] = useState(false)

  const handleDeploy = async () => {
    if (!tokenName || !tokenSymbol || !tokenDecimals || !initialSupply) {
      toast({
        title: "Missing Information",
        description: "Please fill in all token details before deploying.",
        variant: "destructive",
      })
      return
    }

    const success = await deployContract({
      name: tokenName,
      symbol: tokenSymbol,
      decimals: Number.parseInt(tokenDecimals),
      initialSupply: Number.parseInt(initialSupply),
    })

    if (success) {
      toast({
        title: "Contract Deployed",
        description: "Your token contract has been successfully deployed to the Solana blockchain.",
      })
    } else {
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy contract. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(adminState.contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openExplorer = () => {
    window.open(`https://solscan.io/token/${adminState.contractAddress}`, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contract Management</h1>
        <Button
          variant="outline"
          className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>

      {adminState.contractDeployed ? (
        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader>
            <CardTitle>Contract Deployed</CardTitle>
            <CardDescription>Your token contract is live on the Solana blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <h3 className="font-medium text-green-400">Deployment Successful</h3>
                  <p className="text-sm text-green-300/80">Your token contract has been deployed and is ready to use</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Contract Address</Label>
                <div className="flex">
                  <div className="flex-1 p-3 bg-black/30 border border-purple-700/30 rounded-l-md font-mono text-sm overflow-x-auto">
                    {adminState.contractAddress}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-l-none border-l-0 border-purple-700/30"
                    onClick={copyToClipboard}
                  >
                    {copied ? <span className="text-green-400 text-xs">Copied!</span> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-l-none border-l-0 border-purple-700/30 ml-px"
                    onClick={openExplorer}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Token Name</Label>
                  <div className="p-3 bg-black/30 border border-purple-700/30 rounded-md">{tokenName}</div>
                </div>
                <div className="space-y-2">
                  <Label>Token Symbol</Label>
                  <div className="p-3 bg-black/30 border border-purple-700/30 rounded-md">{tokenSymbol}</div>
                </div>
                <div className="space-y-2">
                  <Label>Decimals</Label>
                  <div className="p-3 bg-black/30 border border-purple-700/30 rounded-md">{tokenDecimals}</div>
                </div>
                <div className="space-y-2">
                  <Label>Total Supply</Label>
                  <div className="p-3 bg-black/30 border border-purple-700/30 rounded-md">
                    {Number(initialSupply).toLocaleString()} {tokenSymbol}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
                  onClick={openExplorer}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
                <Button
                  className="bg-purple-700 text-white hover:bg-purple-600"
                  onClick={() => (window.location.href = "/admin/tokens")}
                >
                  Distribute Tokens
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader>
            <CardTitle>Deploy Token Contract</CardTitle>
            <CardDescription>Configure and deploy your token on the Solana blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="token-name">Token Name</Label>
                  <Input
                    id="token-name"
                    placeholder="e.g., Mindera AI"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token-symbol">Token Symbol</Label>
                  <Input
                    id="token-symbol"
                    placeholder="e.g., MND"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="token-decimals">Decimals</Label>
                  <Input
                    id="token-decimals"
                    placeholder="e.g., 9"
                    value={tokenDecimals}
                    onChange={(e) => setTokenDecimals(e.target.value)}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initial-supply">Initial Supply</Label>
                  <Input
                    id="initial-supply"
                    placeholder="e.g., 1000000000"
                    value={initialSupply}
                    onChange={(e) => setInitialSupply(e.target.value)}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="token-metadata">Token Metadata (Optional)</Label>
                <Textarea
                  id="token-metadata"
                  placeholder="Enter additional metadata for your token (JSON format)"
                  className="min-h-[100px] border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-purple-700 text-white hover:bg-purple-600"
                  onClick={handleDeploy}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deploying Contract...
                    </>
                  ) : (
                    "Deploy Contract"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

