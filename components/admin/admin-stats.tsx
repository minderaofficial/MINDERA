"use client"

import { useAdmin } from "@/context/admin-context"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { AlertCircle } from "lucide-react"

export function AdminStats() {
  const { adminState } = useAdmin()

  return (
    <>
      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-yellow-400">Example Data</h3>
          <p className="text-sm text-yellow-300/80">
            The figures shown below are projected examples and do not represent actual sales data. Real transaction data
            will appear here once the presale launches.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Total Raised" value={`$${adminState.totalRaised.toLocaleString()}`} change="+12.5%" positive />
        <StatCard title="Tokens Sold" value={adminState.tokensSold.toLocaleString()} change="+8.3%" positive />
        <StatCard title="Unique Wallets" value={adminState.uniqueWallets.toString()} change="+15.2%" positive />
        <StatCard
          title="Avg. Purchase"
          value={`$${adminState.averagePurchase.toFixed(2)}`}
          change="-2.1%"
          positive={false}
        />

        <Card className="md:col-span-4 border-purple-700/30 bg-black/50">
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Daily Sales (USD)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adminState.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      borderColor: "#333",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="amount" fill="#9333ea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function StatCard({
  title,
  value,
  change,
  positive,
}: {
  title: string
  value: string
  change: string
  positive: boolean
}) {
  return (
    <Card className="border-purple-700/30 bg-black/50">
      <CardContent className="pt-6">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className="text-2xl font-bold mt-2 mb-1">{value}</p>
        <p className={`text-xs ${positive ? "text-green-500" : "text-red-500"}`}>{change} from last week</p>
      </CardContent>
    </Card>
  )
}

