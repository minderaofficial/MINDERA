"use client"

import { useState } from "react"
import { useAdmin } from "@/context/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ExternalLink, Download, Search, Filter } from "lucide-react"

export default function TransactionsPage() {
  const { adminState, searchTransactions, filterTransactions } = useAdmin()
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState(adminState.allTransactions.slice(0, 20))
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: "All",
    status: "All",
    dateFrom: "",
    dateTo: "",
  })

  // Handle search
  const handleSearch = () => {
    const results = searchTransactions(searchQuery)
    setTransactions(results)
    setPage(1)
  }

  // Handle filter
  const handleFilter = () => {
    const dateFrom = filters.dateFrom ? new Date(filters.dateFrom) : undefined
    const dateTo = filters.dateTo ? new Date(filters.dateTo) : undefined

    const results = filterTransactions({
      type: filters.type === "All" ? undefined : filters.type,
      status: filters.status === "All" ? undefined : filters.status,
      dateFrom,
      dateTo,
    })

    setTransactions(results)
    setPage(1)
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      type: "All",
      status: "All",
      dateFrom: "",
      dateTo: "",
    })

    setTransactions(adminState.allTransactions.slice(0, 20))
    setPage(1)
  }

  // Export transactions
  const exportTransactions = () => {
    // Create CSV content
    const headers = ["ID", "Wallet", "Amount", "Tokens", "Timestamp", "Status", "Type"]
    const rows = transactions.map((tx) => [tx.id, tx.wallet, tx.amount, tx.tokens, tx.timestamp, tx.status, tx.type])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `transactions-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Open transaction in explorer
  const openExplorer = (txId: string) => {
    window.open(`https://solscan.io/tx/${txId}`, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
            onClick={exportTransactions}
            disabled={transactions.length === 0}
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
          <CardTitle>Transaction Search</CardTitle>
          <CardDescription>Search for transactions by wallet, token amount, or transaction ID</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search transactions..."
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
              <h3 className="font-medium mb-3">Filter Transactions</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="filter-type">Transaction Type</Label>
                  <select
                    id="filter-type"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full rounded-md border border-purple-700/30 bg-black/50 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="All">All Types</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Distribution">Distribution</option>
                    <option value="Liquidity">Liquidity</option>
                    <option value="Contract">Contract</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-status">Status</Label>
                  <select
                    id="filter-status"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full rounded-md border border-purple-700/30 bg-black/50 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-date-from">From Date</Label>
                  <Input
                    id="filter-date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="filter-date-to">To Date</Label>
                  <Input
                    id="filter-date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                  />
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
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {transactions.length === 0 ? "No transactions found" : `Showing ${transactions.length} transactions`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-900/40">
                    <th className="text-left py-3 px-4 font-medium text-gray-400">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Wallet</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Tokens</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Timestamp</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-purple-900/20">
                      <td className="py-3 px-4 font-mono text-xs">{tx.id.slice(0, 8)}...</td>
                      <td className="py-3 px-4">{tx.wallet}</td>
                      <td className="py-3 px-4">{tx.amount}</td>
                      <td className="py-3 px-4">{tx.tokens}</td>
                      <td className="py-3 px-4">{new Date(tx.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                          ${tx.type === "Purchase" ? "bg-green-500/20 text-green-400" : ""}
                          ${tx.type === "Distribution" ? "bg-blue-500/20 text-blue-400" : ""}
                          ${tx.type === "Liquidity" ? "bg-purple-500/20 text-purple-400" : ""}
                          ${tx.type === "Contract" ? "bg-yellow-500/20 text-yellow-400" : ""}
                          ${tx.type === "Other" ? "bg-gray-500/20 text-gray-400" : ""}
                        `}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium
                          ${tx.status === "Completed" ? "bg-green-500/20 text-green-400" : ""}
                          ${tx.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" : ""}
                          ${tx.status === "Failed" ? "bg-red-500/20 text-red-400" : ""}
                        `}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openExplorer(tx.id)}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">No transactions found matching your search criteria</div>
          )}

          {transactions.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-400">Showing {transactions.length} transactions</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
                  disabled={transactions.length < 20}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

