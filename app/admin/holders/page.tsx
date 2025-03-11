"use client"

import { useState, useEffect } from "react"
import { useAdmin } from "@/context/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Search, Download, Filter, Edit, Trash, AlertTriangle, Lock, Unlock, Loader2 } from "lucide-react"
// Add this import at the top with the other imports
import { Trash2 } from "lucide-react"

export default function HoldersPage() {
  const { adminState, updateHolder, removeTokens, freezeTokens, unfreezeTokens, addHolderName, clearAllHolders } =
    useAdmin()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [holders, setHolders] = useState(adminState.tokenHolders)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minBalance: "",
    maxBalance: "",
    frozen: "all",
  })
  const [editingHolder, setEditingHolder] = useState<string | null>(null)
  const [holderName, setHolderName] = useState("")
  const [removeAmount, setRemoveAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Add this state variable with the other state variables
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  // Update holders when adminState changes
  useEffect(() => {
    setHolders(adminState.tokenHolders)
  }, [adminState.tokenHolders])

  // Handle search
  const handleSearch = () => {
    if (!searchQuery) {
      setHolders(adminState.tokenHolders)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = adminState.tokenHolders.filter(
      (holder) =>
        holder.address.toLowerCase().includes(query) || (holder.name && holder.name.toLowerCase().includes(query)),
    )
    setHolders(filtered)
  }

  // Handle filter
  const handleFilter = () => {
    let filtered = [...adminState.tokenHolders]

    // Filter by min balance
    if (filters.minBalance) {
      const min = Number.parseFloat(filters.minBalance)
      filtered = filtered.filter((holder) => holder.balance >= min)
    }

    // Filter by max balance
    if (filters.maxBalance) {
      const max = Number.parseFloat(filters.maxBalance)
      filtered = filtered.filter((holder) => holder.balance <= max)
    }

    // Filter by frozen status
    if (filters.frozen !== "all") {
      const isFrozen = filters.frozen === "frozen"
      filtered = filtered.filter((holder) => holder.frozen === isFrozen)
    }

    setHolders(filtered)
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      minBalance: "",
      maxBalance: "",
      frozen: "all",
    })
    setHolders(adminState.tokenHolders)
  }

  // Export holders data
  const exportHolders = () => {
    // Create CSV content
    const headers = ["Address", "Name", "Balance", "Value (USD)", "Frozen"]
    const rows = holders.map((holder) => [
      holder.address,
      holder.name || "",
      holder.balance.toString(),
      (holder.balance * adminState.tokenPrice).toFixed(2),
      holder.frozen ? "Yes" : "No",
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `token-holders-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Export Complete",
      description: "Token holders data has been exported to CSV.",
    })
  }

  // Handle adding a name to a holder
  const handleAddName = async (address: string) => {
    if (!holderName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for this holder",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await addHolderName(address, holderName)
      toast({
        title: "Success",
        description: "Holder name has been updated",
      })
      setEditingHolder(null)
      setHolderName("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update holder name",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle removing tokens from a holder
  const handleRemoveTokens = async (address: string) => {
    const amount = Number.parseFloat(removeAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount to remove",
        variant: "destructive",
      })
      return
    }

    const holder = adminState.tokenHolders.find((h) => h.address === address)
    if (!holder || holder.balance < amount) {
      toast({
        title: "Error",
        description: "Cannot remove more tokens than the holder has",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await removeTokens(address, amount)
      toast({
        title: "Success",
        description: `${amount.toLocaleString()} MND tokens have been removed from ${holder.name || address}`,
      })
      setRemoveAmount("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove tokens",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle freezing tokens
  const handleFreezeTokens = async (address: string, currentlyFrozen: boolean) => {
    setIsLoading(true)
    try {
      if (currentlyFrozen) {
        await unfreezeTokens(address)
        toast({
          title: "Success",
          description: "Tokens have been unfrozen",
        })
      } else {
        await freezeTokens(address)
        toast({
          title: "Success",
          description: "Tokens have been frozen",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${currentlyFrozen ? "unfreeze" : "freeze"} tokens`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Add this function before the return statement
  const handleClearAllHolders = async () => {
    setIsLoading(true)
    try {
      const success = await clearAllHolders()

      if (success) {
        toast({
          title: "Success",
          description: "All token holders have been removed",
        })
        setShowConfirmClear(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to remove token holders",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while removing token holders",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Update the first div in the return statement to include the clear all button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Token Holders</h1>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            className="border-red-700/30 bg-red-900/20 text-red-400 hover:bg-red-900/40"
            onClick={() => setShowConfirmClear(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove All Holders
          </Button>
          <Button
            variant="outline"
            className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
            onClick={exportHolders}
            disabled={holders.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
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
          <CardTitle>Holder Search</CardTitle>
          <CardDescription>Search for token holders by address or name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search by address or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500 pr-10"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 border border-purple-700/30 rounded-lg bg-purple-900/10">
              <h3 className="font-medium mb-3">Filter Holders</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="min-balance">Min Balance</Label>
                  <Input
                    id="min-balance"
                    type="number"
                    placeholder="Minimum MND"
                    value={filters.minBalance}
                    onChange={(e) => setFilters({ ...filters, minBalance: e.target.value })}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-balance">Max Balance</Label>
                  <Input
                    id="max-balance"
                    type="number"
                    placeholder="Maximum MND"
                    value={filters.maxBalance}
                    onChange={(e) => setFilters({ ...filters, maxBalance: e.target.value })}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frozen-status">Frozen Status</Label>
                  <select
                    id="frozen-status"
                    value={filters.frozen}
                    onChange={(e) => setFilters({ ...filters, frozen: e.target.value })}
                    className="w-full rounded-md border border-purple-700/30 bg-black/50 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="all">All Holders</option>
                    <option value="frozen">Frozen Only</option>
                    <option value="unfrozen">Unfrozen Only</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button
                  variant="outline"
                  className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
                <Button className="bg-purple-700 text-white hover:bg-purple-600" onClick={handleFilter}>
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-purple-700/30 bg-black/50">
        <CardHeader>
          <CardTitle>Token Holders</CardTitle>
          <CardDescription>
            {holders.length === 0 ? "No holders found" : `Showing ${holders.length} holders`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {holders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-900/40">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Address</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Balance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Value (USD)</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holders.map((holder) => (
                    <tr key={holder.address} className="border-b border-purple-900/20">
                      <td className="py-3 px-4 font-mono text-xs">
                        {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                      </td>
                      <td className="py-3 px-4">
                        {editingHolder === holder.address ? (
                          <div className="flex gap-2">
                            <Input
                              value={holderName}
                              onChange={(e) => setHolderName(e.target.value)}
                              className="h-8 py-1 border-purple-700/30 bg-black/50"
                              placeholder="Enter name"
                            />
                            <Button
                              size="sm"
                              className="h-8 bg-purple-700"
                              onClick={() => handleAddName(holder.address)}
                              disabled={isLoading}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {holder.name || "Unnamed"}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => {
                                setEditingHolder(holder.address)
                                setHolderName(holder.name || "")
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {holder.balance.toLocaleString()} MND
                        <div className="mt-1">
                          {editingHolder === holder.address + "_remove" ? (
                            <div className="flex gap-2 mt-1">
                              <Input
                                value={removeAmount}
                                onChange={(e) => setRemoveAmount(e.target.value)}
                                className="h-8 py-1 border-purple-700/30 bg-black/50"
                                placeholder="Amount"
                                type="number"
                              />
                              <Button
                                size="sm"
                                className="h-8 bg-red-700"
                                onClick={() => handleRemoveTokens(holder.address)}
                                disabled={isLoading}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 py-0 px-2 text-xs border-red-500/30 text-red-400 hover:bg-red-900/20"
                              onClick={() => setEditingHolder(holder.address + "_remove")}
                            >
                              <Trash className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">${(holder.balance * adminState.tokenPrice).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            holder.frozen ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {holder.frozen ? "Frozen" : "Active"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`h-8 ${
                            holder.frozen
                              ? "border-green-500/30 text-green-400 hover:bg-green-900/20"
                              : "border-red-500/30 text-red-400 hover:bg-red-900/20"
                          }`}
                          onClick={() => handleFreezeTokens(holder.address, holder.frozen)}
                          disabled={isLoading}
                        >
                          {holder.frozen ? (
                            <>
                              <Unlock className="h-4 w-4 mr-1" />
                              Unfreeze
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4 mr-1" />
                              Freeze
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">No token holders found matching your criteria</div>
          )}
        </CardContent>
      </Card>

      <Card className="border-purple-700/30 bg-black/50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />
            Token Management Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              <strong>Removing Tokens:</strong> This action permanently removes tokens from a holder's balance. This
              should only be used in cases of fraud, security breaches, or compliance requirements.
            </p>
            <p>
              <strong>Freezing Tokens:</strong> When a holder's tokens are frozen, they cannot transfer, sell, or
              otherwise use their tokens until they are unfrozen. This is a temporary measure that can be reversed.
            </p>
            <p>
              <strong>Adding Names:</strong> Names are only visible in the admin panel and help you identify holders.
              They are not visible on the blockchain or to other users.
            </p>
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg mt-4">
              <p className="font-medium text-yellow-400">Important Note</p>
              <p className="text-yellow-300/80 mt-1">
                All actions are logged and should comply with your project's legal and regulatory requirements. Use
                these features responsibly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add this confirmation modal at the end of the return statement, before the closing </div> */}
      {showConfirmClear && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="border-red-700/50 bg-black/90 w-full max-w-md">
            <CardHeader className="bg-red-900/20 border-b border-red-700/30">
              <CardTitle className="flex items-center text-red-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Remove All Token Holders
              </CardTitle>
              <CardDescription className="text-red-300/80">
                This action will remove ALL token holders from the system
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h3 className="font-medium text-red-400">WARNING</h3>
                  <p className="text-sm text-red-300/80 mt-1">
                    This action will permanently remove all token holders from the system. This cannot be undone.
                  </p>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-between p-6 border-t border-red-700/30">
              <Button
                variant="outline"
                className="border-red-700/30 text-red-400 hover:bg-red-900/20"
                onClick={() => setShowConfirmClear(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-700 text-white hover:bg-red-600"
                onClick={handleClearAllHolders}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Removal"
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

