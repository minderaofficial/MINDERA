"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/context/wallet-context"
import { usePresale } from "@/context/presale-context"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertCircle, Copy, ExternalLink, CheckCircle, XCircle } from "lucide-react"

// Presale wallet address
const PRESALE_WALLET_ADDRESS = "946svTRVZa4KGU8NkvVSJwU9NkHdzr9Q5LFkhVHQUwdh"

// Minimum buy-in amount in SOL
const MIN_BUY_IN = 0.04

export function PresaleForm() {
  const [amount, setAmount] = useState<string>("")
  const [tokenAmount, setTokenAmount] = useState<number>(0)
  const [exceedsLimit, setExceedsLimit] = useState(false)
  const [belowMinimum, setBelowMinimum] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [transactionId, setTransactionId] = useState("")
  const [transactionError, setTransactionError] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "error">("idle")
  const { account } = useWallet()
  const { presaleData, recordPurchase, calculateTokens, isLoading, checkTokenAvailability } = usePresale()
  const { toast } = useToast()
  const [localLoading, setLocalLoading] = useState(false)

  // Calculate token amount based on input and check limits
  useEffect(() => {
    if (amount) {
      const amountValue = Number.parseFloat(amount)
      const tokens = calculateTokens(amount)
      setTokenAmount(tokens)
      setExceedsLimit(!checkTokenAvailability(tokens))
      setBelowMinimum(amountValue < MIN_BUY_IN)
    } else {
      setTokenAmount(0)
      setExceedsLimit(false)
      setBelowMinimum(false)
    }
  }, [amount, presaleData.solanaPrice, calculateTokens, checkTokenAvailability])

  // Function to validate the purchase
  const validatePurchase = (tokenAmount: number): { valid: boolean; message?: string } => {
    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      return { valid: false, message: "Please enter a valid amount" }
    }

    if (Number.parseFloat(amount) < MIN_BUY_IN) {
      return { valid: false, message: `Minimum purchase amount is ${MIN_BUY_IN} SOL` }
    }

    if (!checkTokenAvailability(tokenAmount)) {
      return {
        valid: false,
        message: `Purchase exceeds remaining token limit. Only ${presaleData.remainingTokens.toLocaleString()} MND tokens available.`,
      }
    }

    return { valid: true }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(PRESALE_WALLET_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Open Solana Explorer for the transaction
  const openExplorer = () => {
    if (transactionId) {
      window.open(`https://solscan.io/tx/${transactionId}`, "_blank")
    }
  }

  // Validate transaction ID format
  const validateTransactionId = (txId: string) => {
    setTransactionId(txId)
    setVerificationStatus("idle")
    setTransactionError("")
  }

  // Handle purchase button click
  const handlePurchase = () => {
    if (presaleData.isPaused) {
      toast({
        title: "Presale Paused",
        description: "The presale is currently paused. Please check back later.",
        variant: "destructive",
      })
      return
    }

    if (!account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue",
        variant: "destructive",
      })
      return
    }

    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    // Check if purchase is valid
    const validation = validatePurchase(tokenAmount)
    if (!validation.valid) {
      toast({
        title: "Invalid purchase",
        description: validation.message || "Invalid purchase amount",
        variant: "destructive",
      })
      return
    }

    // Show instructions
    setShowInstructions(true)
  }

  // Verify transaction on the blockchain
  const verifyTransaction = async () => {
    if (!transactionId.trim()) {
      setTransactionError("Please enter a transaction ID")
      return
    }

    setVerificationStatus("verifying")
    setTransactionError("")

    try {
      const response = await fetch("/api/verify-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: transactionId.trim(),
          expectedAmount: amount,
          senderAddress: account,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setVerificationStatus("success")
        recordPurchase(amount)

        toast({
          title: "Transaction Verified",
          description: `Your purchase of ${tokenAmount.toLocaleString()} MND tokens has been verified and recorded.`,
        })

        setTimeout(() => {
          setShowInstructions(false)
          setAmount("")
          setTransactionId("")
          setTransactionError("")
          setVerificationStatus("idle")
        }, 2000)
      } else {
        setVerificationStatus("error")

        // Special handling for already used transactions
        if (data.error && data.error.includes("already been used")) {
          setTransactionError("This transaction has already been used for a token purchase")

          toast({
            title: "Transaction Already Used",
            description:
              "This transaction has already been used for a token purchase. Please use a different transaction.",
            variant: "destructive",
          })
        } else {
          setTransactionError(data.error || "Transaction verification failed")

          toast({
            title: "Verification Failed",
            description: data.error || "Failed to verify transaction",
            variant: "destructive",
          })
        }
      }
    } catch (error: any) {
      console.error("Verification error:", error)
      setVerificationStatus("error")
      setTransactionError("Failed to verify transaction. Please try again.")

      toast({
        title: "Verification Error",
        description: "Failed to verify transaction. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-4">
      {!showInstructions ? (
        <>
          <div className="grid gap-2">
            <Label htmlFor="amount">Purchase Amount (SOL)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                placeholder={`Enter amount (min ${MIN_BUY_IN} SOL)`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500 ${exceedsLimit || belowMinimum ? "border-red-500" : ""}`}
                disabled={isLoading || localLoading}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                = {tokenAmount.toLocaleString()} MND
              </div>
            </div>
            {exceedsLimit && (
              <div className="flex items-center text-red-500 text-xs mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Exceeds available tokens
              </div>
            )}
            {belowMinimum && (
              <div className="flex items-center text-red-500 text-xs mt-1">
                <AlertCircle className="h-3 w-3 mr-1" />
                Minimum purchase is {MIN_BUY_IN} SOL
              </div>
            )}
            {presaleData.solanaPrice && (
              <p className="text-xs text-gray-400">
                Current SOL price: ${presaleData.solanaPrice.usd.toFixed(2)} USD
                <span className="ml-2 text-xs">
                  {presaleData.solanaPrice.usd_24h_change > 0 ? (
                    <span className="text-green-500">↑ {presaleData.solanaPrice.usd_24h_change.toFixed(2)}%</span>
                  ) : (
                    <span className="text-red-500">
                      ↓ {Math.abs(presaleData.solanaPrice.usd_24h_change).toFixed(2)}%
                    </span>
                  )}
                </span>
              </p>
            )}
            <p className="text-xs text-gray-400">
              Remaining tokens: {presaleData.remainingTokens.toLocaleString()} MND
            </p>
            {presaleData.lastUpdated && (
              <p className="text-xs text-gray-500">Last updated: {presaleData.lastUpdated.toLocaleTimeString()}</p>
            )}
          </div>

          <Button
            className="w-full bg-purple-700 text-white hover:bg-purple-600"
            onClick={handlePurchase}
            disabled={isLoading || localLoading || exceedsLimit || belowMinimum}
          >
            {isLoading || localLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Buy MND Tokens"
            )}
          </Button>

          <p className="text-xs text-center text-gray-400">
            By purchasing tokens you agree to our{" "}
            <a href="/?section=terms" className="text-purple-400 hover:underline">
              Terms & Conditions
            </a>
          </p>
        </>
      ) : (
        <div className="border border-purple-500 rounded-lg p-4 bg-purple-900/10">
          <h3 className="text-lg font-medium mb-3">Complete Your Purchase</h3>

          <div className="space-y-4">
            <p>To purchase {tokenAmount.toLocaleString()} MND tokens:</p>

            <ol className="list-decimal pl-5 space-y-2">
              <li>Open your wallet app</li>
              <li>
                Send <span className="font-bold">{amount} SOL</span> to:
              </li>
              <li className="relative">
                <div className="break-all font-mono text-xs bg-black/30 p-2 rounded flex items-center justify-between">
                  <span>{PRESALE_WALLET_ADDRESS}</span>
                  <button
                    onClick={copyToClipboard}
                    className="ml-2 p-1 rounded hover:bg-purple-800/50"
                    aria-label="Copy address"
                  >
                    {copied ? <span className="text-green-400 text-xs">Copied!</span> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </li>
              <li>After sending, enter your transaction ID/hash below</li>
            </ol>

            <div className="mt-2">
              <Label htmlFor="transaction-id">Transaction ID/Hash</Label>
              <div className="flex mt-1">
                <Input
                  id="transaction-id"
                  type="text"
                  placeholder="Enter your Solana transaction signature"
                  value={transactionId}
                  onChange={(e) => validateTransactionId(e.target.value)}
                  className={`border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500 ${transactionError ? "border-red-500" : ""}`}
                />
                {transactionId && !transactionError && (
                  <Button variant="outline" size="icon" className="ml-2 border-purple-700/30" onClick={openExplorer}>
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {transactionError && <p className="text-red-500 text-xs mt-1">{transactionError}</p>}

              {verificationStatus === "success" && (
                <div className="flex items-center text-green-500 text-xs mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Transaction verified successfully!
                </div>
              )}

              {verificationStatus === "error" && !transactionError && (
                <div className="flex items-center text-red-500 text-xs mt-1">
                  <XCircle className="h-3 w-3 mr-1" />
                  Verification failed. Please check your transaction ID.
                </div>
              )}

              <p className="text-xs text-gray-400 mt-2">
                You can find your transaction signature in your wallet's transaction history or on Solana Explorer.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowInstructions(false)
                  setTransactionId("")
                  setTransactionError("")
                  setVerificationStatus("idle")
                }}
                className="border-purple-700/50"
              >
                Cancel
              </Button>
              <Button
                className={`text-white ${verificationStatus === "success" ? "bg-green-600 hover:bg-green-700" : "bg-purple-700 hover:bg-purple-600"}`}
                onClick={verifyTransaction}
                disabled={verificationStatus === "verifying" || verificationStatus === "success" || !transactionId}
              >
                {verificationStatus === "verifying" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : verificationStatus === "success" ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verified!
                  </>
                ) : (
                  "Verify Transaction"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

