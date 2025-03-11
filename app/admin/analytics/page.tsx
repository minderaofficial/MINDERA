"use client"

import { useState } from "react"
import { useAdmin } from "@/context/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download } from "lucide-react"

export default function AnalyticsPage() {
  const { adminState } = useAdmin()
  const [timeframe, setTimeframe] = useState("daily")

  // Format data for charts
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  // Export analytics data
  const exportAnalytics = () => {
    // Create CSV content based on current tab
    let headers: string[] = []
    let rows: any[][] = []

    if (timeframe === "daily") {
      headers = ["Date", "Amount"]
      rows = adminState.analytics.dailySales.map((item) => [item.date, item.amount])
    } else if (timeframe === "weekly") {
      headers = ["Week", "Amount"]
      rows = adminState.analytics.weeklySales.map((item) => [item.week, item.amount])
    } else if (timeframe === "country") {
      headers = ["Country", "Amount"]
      rows = adminState.analytics.countrySales.map((item) => [item.country, item.amount])
    } else if (timeframe === "device") {
      headers = ["Device", "Amount"]
      rows = adminState.analytics.deviceSales.map((item) => [item.device, item.amount])
    }

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `analytics-${timeframe}-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Colors for pie charts
  const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c", "#d0ed57", "#ffc658"]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
            onClick={exportAnalytics}
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
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Summary of token sales and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
              <p className="text-2xl font-bold">${adminState.totalRaised.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Tokens Sold</h3>
              <p className="text-2xl font-bold">{adminState.tokensSold.toLocaleString()} MND</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Unique Buyers</h3>
              <p className="text-2xl font-bold">{adminState.uniqueWallets}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Avg. Purchase</h3>
              <p className="text-2xl font-bold">${adminState.averagePurchase.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily" className="w-full" onValueChange={setTimeframe}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="daily">Daily Sales</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Sales</TabsTrigger>
          <TabsTrigger value="country">Sales by Country</TabsTrigger>
          <TabsTrigger value="device">Sales by Device</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Daily Sales</CardTitle>
              <CardDescription>Token sales over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adminState.analytics.dailySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      formatter={formatCurrency}
                      contentStyle={{
                        backgroundColor: "#111",
                        borderColor: "#333",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="amount" name="Sales (USD)" fill="#9333ea" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Weekly Sales</CardTitle>
              <CardDescription>Token sales over the past 4 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={adminState.analytics.weeklySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="week" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      formatter={formatCurrency}
                      contentStyle={{
                        backgroundColor: "#111",
                        borderColor: "#333",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="amount" name="Sales (USD)" stroke="#9333ea" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="country">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Sales by Country</CardTitle>
              <CardDescription>Distribution of token sales by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={adminState.analytics.countrySales}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {adminState.analytics.countrySales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={formatCurrency}
                      contentStyle={{
                        backgroundColor: "#111",
                        borderColor: "#333",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="device">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Sales by Device</CardTitle>
              <CardDescription>Distribution of token sales by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={adminState.analytics.deviceSales}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {adminState.analytics.deviceSales.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={formatCurrency}
                      contentStyle={{
                        backgroundColor: "#111",
                        borderColor: "#333",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

