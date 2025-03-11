"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PresaleStats } from "@/components/presale-stats"
import { PresaleForm } from "@/components/presale-form"
import { PresaleStages } from "@/components/presale-stages"
import { useWallet } from "@/context/wallet-context"
import { usePresale } from "@/context/presale-context"
import { Button } from "@/components/ui/button"
import { Clock, AlertTriangle, Rocket } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { getPresaleState } from "@/lib/presale-state"

export function PresaleDashboard() {
  const { isConnected, connect } = useWallet()
  const { presaleData } = usePresale()
  const presaleFormRef = useRef<HTMLDivElement>(null)

  // Force a re-render when the component mounts to ensure we have the latest state
  const [, forceUpdate] = useState({})

  useEffect(() => {
    // Force a re-render to ensure we have the latest state
    forceUpdate({})

    // Log the current state for debugging
    const sharedState = getPresaleState()
    console.log("Dashboard - Shared presale state:", sharedState)
    console.log("Dashboard - Context presale state:", presaleData)
  }, [])

  const handleConnectWallet = () => {
    connect()
  }

  const scrollToPresaleForm = () => {
    if (presaleFormRef.current) {
      presaleFormRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Get the current state directly from the shared service
  const currentState = getPresaleState()
  const isReleased = currentState.isReleased || presaleData.isReleased
  const isPaused = currentState.isPaused || presaleData.isPaused

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Mindera AI
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
            Token Presale
          </span>
        </h1>
        <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed">
          Join our presale to secure $MND tokens at the lowest possible price before our public launch.
        </p>
      </div>

      <Card className="border-purple-700/30 bg-black/50">
        <CardHeader className="bg-purple-900/20 border-b border-purple-700/30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <CardTitle>Presale Stage 1</CardTitle>
              <CardDescription>Limited allocation available</CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6" id="presale">
          {!isReleased ? (
            // Show "Stay tuned for release" message when presale is not released
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-8 text-center">
              <Rocket className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-medium text-purple-400 text-xl mb-2">Stay Tuned for Release</h3>
              <p className="text-gray-300 max-w-md mx-auto">
                Our presale is coming soon! Connect your wallet and be ready for the launch to secure your tokens at the
                best price.
              </p>
              {!isConnected && (
                <Button className="bg-purple-700 text-white hover:bg-purple-600 mt-6" onClick={handleConnectWallet}>
                  Connect Wallet
                </Button>
              )}
            </div>
          ) : isPaused ? (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-400 text-lg">PRESALE PAUSED</h3>
                <p className="text-red-300/80">The presale is temporarily paused. Please check back later.</p>
              </div>
            </div>
          ) : (
            <>
              <PresaleStats />

              <div ref={presaleFormRef}>
                {isConnected ? (
                  <PresaleForm />
                ) : (
                  <div className="text-center p-6 border border-dashed border-purple-700/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
                    <p className="text-gray-400 mb-4">
                      Please connect your Solana wallet to participate in the presale
                    </p>
                    <Button className="bg-purple-700 text-white hover:bg-purple-600" onClick={handleConnectWallet}>
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </div>

              {isConnected && !isPaused && (
                <Button className="bg-purple-700 text-white hover:bg-purple-600" onClick={scrollToPresaleForm}>
                  Buy MND Tokens
                </Button>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="bg-purple-900/10 p-6 border-t border-purple-700/30 block">
          <PresaleStages />
        </CardFooter>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-900/20 text-purple-400">
                1
              </div>
              <div>
                <h3 className="font-medium">Connect Your Wallet</h3>
                <p className="text-sm text-gray-400">Connect your Solana wallet (Phantom, Solflare, etc.)</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-900/20 text-purple-400">
                2
              </div>
              <div>
                <h3 className="font-medium">Enter Purchase Amount</h3>
                <p className="text-sm text-gray-400">Decide how many tokens you want to purchase</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-900/20 text-purple-400">
                3
              </div>
              <div>
                <h3 className="font-medium">Confirm Transaction</h3>
                <p className="text-sm text-gray-400">Approve the transaction in your wallet</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-900/20 text-purple-400">
                4
              </div>
              <div>
                <h3 className="font-medium">Receive Tokens</h3>
                <p className="text-sm text-gray-400">Tokens will be available for claim after the presale ends</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader>
            <CardTitle>Tokenomics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Total Supply</h3>
              <p className="text-2xl font-bold">1,000,000,000 MND</p>
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Presale</span>
                  <span>30%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[30%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Team & Advisors</span>
                  <span>15%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Development</span>
                  <span>20%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[20%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Marketing</span>
                  <span>15%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Liquidity</span>
                  <span>10%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[10%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Reserve</span>
                  <span>10%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[10%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

