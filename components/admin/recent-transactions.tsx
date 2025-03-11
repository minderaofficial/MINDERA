"use client"

import { useState } from "react"
import { useAdmin } from "@/context/admin-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function RecentTransactions() {
  const { adminState } = useAdmin()
  const [page, setPage] = useState(1)

  const openExplorer = (txId: string) => {
    window.open(`https://solscan.io/tx/${txId}`, "_blank")
  }

  return (
    <Card className="border-purple-700/30 bg-black/50">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest token purchases and distributions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-purple-900/40">
                <th className="text-left py-3 px-4 font-medium text-gray-400">Wallet</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Tokens</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminState.recentTransactions.map((tx) => (
                <tr key={tx.id} className="border-b border-purple-900/20">
                  <td className="py-3 px-4">{tx.wallet}</td>
                  <td className="py-3 px-4">{tx.amount}</td>
                  <td className="py-3 px-4">{tx.tokens}</td>
                  <td className="py-3 px-4">{tx.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
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

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-400">
            Showing {adminState.recentTransactions.length} of {adminState.recentTransactions.length} transactions
          </p>
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
              disabled={true} // Disabled when there are no more pages
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

