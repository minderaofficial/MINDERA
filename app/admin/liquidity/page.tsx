"use client"

import { useState } from "react"
import { useAdmin } from "@/context/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, AlertTriangle, ShieldAlert } from "lucide-react"

export default function LiquidityManagement() {
  const { adminState, addLiquidity, removeLiquidity, emergencyUnlockLiquidity, isLoading } = useAdmin()
  const { toast } = useToast()

  const [poolType, setPoolType] = useState("MND/SOL")
  const [amount, setAmount] = useState("")
  const [lockLiquidity, setLockLiquidity] = useState(true)
  const [lockDays, setLockDays] = useState("90")
  const [poolToRemove, setPoolToRemove] = useState("")
  const [confirmRemoval, setConfirmRemoval] = useState(false)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [emergencyPassword, setEmergencyPassword] = useState("")
  const [confirmEmergency, setConfirmEmergency] = useState(false)

  const handleAddLiquidity = async () => {
    if (!poolType || !amount) {
      toast({
        title: "Missing Information",
        description: "Please enter both pool type and amount.",
        variant: "destructive",
      })
      return
    }

    const amountValue = Number.parseFloat(amount)
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      })
      return
    }

    const success = await addLiquidity(poolType, amountValue, lockLiquidity ? Number.parseInt(lockDays) : 0)

    if (success) {
      toast({
        title: "Liquidity Added",
        description: `${amountValue.toLocaleString()} MND tokens have been added to the ${poolType} pool.`,
      })
      setAmount("")
    } else {
      toast({
        title: "Failed to Add Liquidity",
        description: "An error occurred while adding liquidity. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveLiquidity = async () => {
    if (!poolToRemove) {
      toast({
        title: "No Pool Selected",
        description: "Please select a liquidity pool to remove.",
        variant: "destructive",
      })
      return
    }

    if (!confirmRemoval) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm liquidity removal by checking the confirmation box.",
        variant: "destructive",
      })
      return
    }

    const pool = adminState.liquidityPools.find((p) => p.id === poolToRemove)

    if (pool?.locked) {
      toast({
        title: "Locked Liquidity",
        description: "This liquidity pool is locked and cannot be removed until the lock period ends.",
        variant: "destructive",
      })
      return
    }

    const success = await removeLiquidity(poolToRemove)

    if (success) {
      toast({
        title: "Liquidity Removed",
        description: "The liquidity pool has been successfully removed.",
      })
      setPoolToRemove("")
      setConfirmRemoval(false)
    } else {
      toast({
        title: "Failed to Remove Liquidity",
        description: "An error occurred while removing liquidity. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Emergency unlock all liquidity
  const handleEmergencyUnlock = async () => {
    if (!emergencyPassword) {
      toast({
        title: "Password Required",
        description: "Please enter the emergency password.",
        variant: "destructive",
      })
      return
    }

    if (!confirmEmergency) {
      toast({
        title: "Confirmation Required",
        description: "Please confirm emergency unlock by checking the confirmation box.",
        variant: "destructive",
      })
      return
    }

    // Use the hardcoded password directly for demo purposes
    // In production, this would be a secure server-side check
    const success = emergencyPassword === "AAmi220773!mindera" ? true : false

    if (success) {
      // Call the actual unlock function
      await emergencyUnlockLiquidity(emergencyPassword)

      toast({
        title: "Emergency Unlock Successful",
        description: "All liquidity pools have been unlocked.",
      })
      setShowEmergencyModal(false)
      setEmergencyPassword("")
      setConfirmEmergency(false)
    } else {
      toast({
        title: "Emergency Unlock Failed",
        description: "Invalid password or an error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Liquidity Management</h1>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            className="bg-red-700 hover:bg-red-600"
            onClick={() => setShowEmergencyModal(true)}
          >
            <ShieldAlert className="h-4 w-4 mr-2" />
            Emergency Unlock
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
          <CardTitle>Liquidity Overview</CardTitle>
          <CardDescription>Current liquidity pools and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Total Liquidity Value</h3>
              <p className="text-2xl font-bold">${adminState.totalLiquidity.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Active Pools</h3>
              <p className="text-2xl font-bold">{adminState.liquidityPools.length}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Locked Pools</h3>
              <p className="text-2xl font-bold">{adminState.liquidityPools.filter((p) => p.locked).length}</p>
            </div>
          </div>

          {adminState.liquidityPools.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-4">Active Liquidity Pools</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-purple-900/40">
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Pool</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Value</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-400">Lock End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminState.liquidityPools.map((pool) => (
                      <tr key={pool.id} className="border-b border-purple-900/20">
                        <td className="py-3 px-4">{pool.name}</td>
                        <td className="py-3 px-4">{pool.amount.toLocaleString()} MND</td>
                        <td className="py-3 px-4">${pool.value.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded-full ${pool.locked ? "bg-purple-500/20 text-purple-400" : "bg-green-500/20 text-green-400"} text-xs font-medium`}
                          >
                            {pool.locked ? "Locked" : "Unlocked"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {pool.locked && pool.lockEndDate ? pool.lockEndDate.toLocaleDateString() : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="add" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="add">Add Liquidity</TabsTrigger>
          <TabsTrigger value="remove">Remove Liquidity</TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Add Liquidity</CardTitle>
              <CardDescription>Add tokens to a liquidity pool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pool-type">Pool Type</Label>
                  <select
                    id="pool-type"
                    value={poolType}
                    onChange={(e) => setPoolType(e.target.value)}
                    className="w-full rounded-md border border-purple-700/30 bg-black/50 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    disabled={isLoading}
                  >
                    <option value="MND/SOL">MND/SOL</option>
                    <option value="MND/USDC">MND/USDC</option>
                    <option value="MND/USDT">MND/USDT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Token Amount</Label>
                  <Input
                    id="amount"
                    placeholder="Enter amount of MND tokens"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lock-liquidity" className="cursor-pointer">
                      Lock Liquidity
                    </Label>
                    <Switch
                      id="lock-liquidity"
                      checked={lockLiquidity}
                      onCheckedChange={setLockLiquidity}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Locking liquidity increases trust by preventing immediate removal
                  </p>
                </div>

                {lockLiquidity && (
                  <div className="space-y-2">
                    <Label htmlFor="lock-days">Lock Period (Days)</Label>
                    <Input
                      id="lock-days"
                      type="number"
                      placeholder="Enter lock period in days"
                      value={lockDays}
                      onChange={(e) => setLockDays(e.target.value)}
                      className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                      disabled={isLoading}
                    />
                  </div>
                )}

                <Button
                  className="bg-purple-700 text-white hover:bg-purple-600 w-full"
                  onClick={handleAddLiquidity}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Add Liquidity"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remove">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Remove Liquidity</CardTitle>
              <CardDescription>Remove tokens from a liquidity pool</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="pool-to-remove">Select Pool</Label>
                  <select
                    id="pool-to-remove"
                    value={poolToRemove}
                    onChange={(e) => setPoolToRemove(e.target.value)}
                    className="w-full rounded-md border border-purple-700/30 bg-black/50 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    disabled={isLoading}
                  >
                    <option value="">Select a pool</option>
                    {adminState.liquidityPools.map((pool) => (
                      <option key={pool.id} value={pool.id} disabled={pool.locked}>
                        {pool.name} - {pool.amount.toLocaleString()} MND {pool.locked ? "(Locked)" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {poolToRemove && (
                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-400">Warning</h3>
                      <p className="text-sm text-yellow-300/80 mt-1">
                        Removing liquidity will reduce the stability of your token's price. This action cannot be
                        undone.
                      </p>
                      <div className="flex items-center mt-3">
                        <input
                          type="checkbox"
                          id="confirm-removal"
                          checked={confirmRemoval}
                          onChange={(e) => setConfirmRemoval(e.target.checked)}
                          className="mr-2"
                          disabled={isLoading}
                        />
                        <Label htmlFor="confirm-removal" className="text-sm cursor-pointer">
                          I understand and confirm liquidity removal
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  className="bg-red-700 text-white hover:bg-red-600 w-full"
                  onClick={handleRemoveLiquidity}
                  disabled={isLoading || !poolToRemove || !confirmRemoval}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Remove Liquidity"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Emergency Unlock Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="border-red-700/50 bg-black/90 w-full max-w-md">
            <CardHeader className="bg-red-900/20 border-b border-red-700/30">
              <CardTitle className="flex items-center text-red-400">
                <ShieldAlert className="h-5 w-5 mr-2" />
                Emergency Liquidity Unlock
              </CardTitle>
              <CardDescription className="text-red-300/80">
                This action will unlock ALL liquidity pools immediately
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h3 className="font-medium text-red-400">CRITICAL WARNING</h3>
                  <p className="text-sm text-red-300/80 mt-1">
                    Emergency unlocking all liquidity should ONLY be done in extreme circumstances. This action cannot
                    be undone and may significantly impact token price stability.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency-password" className="text-red-300">
                    Admin Password
                  </Label>
                  <Input
                    id="emergency-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={emergencyPassword}
                    onChange={(e) => setEmergencyPassword(e.target.value)}
                    className="border-red-700/30 bg-black/50 focus:border-red-500 focus:ring-red-500"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    id="confirm-emergency"
                    checked={confirmEmergency}
                    onChange={(e) => setConfirmEmergency(e.target.checked)}
                    className="mr-2"
                    disabled={isLoading}
                  />
                  <Label htmlFor="confirm-emergency" className="text-sm cursor-pointer text-red-300">
                    I understand this is an emergency action and confirm unlocking all liquidity
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-red-700/30 pt-4">
              <Button
                variant="outline"
                className="border-red-700/30 text-red-400 hover:bg-red-900/20"
                onClick={() => setShowEmergencyModal(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-700 text-white hover:bg-red-600"
                onClick={handleEmergencyUnlock}
                disabled={isLoading || !emergencyPassword || !confirmEmergency}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Emergency Unlock"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}

