"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { removeLiquidity } from "@/actions/admin-actions"

export function LiquiditySection() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleRemoveLiquidity = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await removeLiquidity(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
      } else {
        throw new Error(result.error || "Failed to remove liquidity")
      }
    } catch (error) {
      console.error("Error removing liquidity:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove liquidity",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-orange-500/30 bg-black/50">
      <CardHeader>
        <CardTitle>Manage Liquidity</CardTitle>
        <CardDescription>Remove a percentage of the current liquidity pool.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleRemoveLiquidity} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="percentage">Percentage to Remove (%)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="percentage"
                name="percentage"
                type="number"
                min="1"
                max="100"
                placeholder="Enter percentage (1-100)"
                required
                className="flex-1"
              />
              <span>%</span>
            </div>
            <p className="text-xs text-gray-400">
              Enter a value between 1 and 100 to remove that percentage of the current liquidity.
            </p>
          </div>
          <Button type="submit" variant="destructive" disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Remove Liquidity"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

