"use client"

import { useAdmin } from "@/context/admin-context"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentTransactions } from "@/components/admin/recent-transactions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket, Bug } from "lucide-react"
import Link from "next/link"
import { getPresaleState, updatePresaleState } from "@/lib/presale-state"
import { useToast } from "@/components/ui/use-toast"

export default function AdminDashboard() {
  const { adminState, releasePresale } = useAdmin()
  const { toast } = useToast()

  // Function to force reset the presale state (for debugging)
  const forceResetPresaleState = () => {
    updatePresaleState({
      isReleased: true,
      isPaused: false,
    })

    toast({
      title: "Debug: State Reset",
      description: "Presale state has been forcibly reset to released and unpaused.",
    })
  }

  // Get current state for display
  const currentState = getPresaleState()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20" asChild>
            <Link href="/admin/settings">Settings</Link>
          </Button>
          <Button className="bg-purple-700 text-white hover:bg-purple-600" asChild>
            <Link href="/">View Website</Link>
          </Button>
        </div>
      </div>

      {/* Debug Card */}
      <Card className="border-purple-700/30 bg-black/50 border-2 border-yellow-500">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Debug Information</h3>
          <div className="space-y-2 mb-4">
            <p>
              <strong>Shared State:</strong> Released: {currentState.isReleased ? "Yes" : "No"}, Paused:{" "}
              {currentState.isPaused ? "Yes" : "No"}
            </p>
            <p>
              <strong>Admin State:</strong> Released: {adminState.presaleReleased ? "Yes" : "No"}, Active:{" "}
              {adminState.presaleActive ? "Yes" : "No"}
            </p>
          </div>
          <Button
            variant="destructive"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
            onClick={forceResetPresaleState}
          >
            <Bug className="mr-2 h-4 w-4" />
            Force Reset Presale State
          </Button>
        </CardContent>
      </Card>

      {/* Presale Release Card */}
      {!adminState.presaleReleased && (
        <Card className="border-purple-700/30 bg-black/50 border-2 border-purple-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Rocket className="h-10 w-10 text-purple-400" />
              <div>
                <h3 className="text-xl font-bold">Presale Not Released</h3>
                <p className="text-gray-400">The presale is currently in preparation mode and not visible to users.</p>
              </div>
            </div>
            <Button className="bg-purple-700 text-white hover:bg-purple-600" onClick={releasePresale}>
              Release Presale
            </Button>
          </CardContent>
        </Card>
      )}

      <AdminStats />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader>
            <CardTitle>Presale Status</CardTitle>
            <CardDescription>Current presale stage and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    adminState.presaleActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  } text-xs font-medium`}
                >
                  {adminState.presaleActive ? "Active" : "Paused"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Released</span>
                <span
                  className={`px-2 py-1 rounded-full ${
                    adminState.presaleReleased ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  } text-xs font-medium`}
                >
                  {adminState.presaleReleased ? "Released" : "Not Released"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Stage</span>
                <span>Stage {adminState.currentStage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Token Price</span>
                <span>${adminState.stages.find((s) => s.id === adminState.currentStage)?.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tokens Sold</span>
                <span>{adminState.tokensSold.toLocaleString()} MND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Funds Raised</span>
                <span>${adminState.totalRaised.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage presale and token distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Link
                href="/admin/presale"
                className="px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-700/30 hover:bg-purple-900/30 transition-colors flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">Manage Presale</h3>
                  <p className="text-sm text-gray-400">Change stages, pricing, and settings</p>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-400" />
              </Link>
              <Link
                href="/admin/tokens"
                className="px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-700/30 hover:bg-purple-900/30 transition-colors flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">Distribute Tokens</h3>
                  <p className="text-sm text-gray-400">Allocate tokens to wallets</p>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-400" />
              </Link>
              <Link
                href="/admin/contract"
                className="px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-700/30 hover:bg-purple-900/30 transition-colors flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">Contract Management</h3>
                  <p className="text-sm text-gray-400">Launch and manage token contract</p>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-400" />
              </Link>
              <Link
                href="/admin/liquidity"
                className="px-4 py-3 rounded-lg bg-purple-900/20 border border-purple-700/30 hover:bg-purple-900/30 transition-colors flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium">Liquidity Management</h3>
                  <p className="text-sm text-gray-400">Add or remove liquidity from pools</p>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-400" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <RecentTransactions />
    </div>
  )
}

