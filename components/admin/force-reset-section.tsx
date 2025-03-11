"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { forceResetPresaleState } from "@/actions/admin-actions"

export function ForceResetSection() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset the presale state? This will set isReleased to FALSE and isPaused to TRUE.",
      )
    ) {
      return
    }

    setIsLoading(true)
    try {
      const result = await forceResetPresaleState()

      if (result.success) {
        toast({
          title: "Success",
          description:
            result.message || "Presale state has been reset. isReleased is now false and isPaused is now true.",
        })

        // Force a page reload to ensure all components update their state
        window.location.reload()
      } else {
        throw new Error(result.error || "Failed to reset presale state")
      }
    } catch (error) {
      console.error("Error resetting presale state:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset presale state",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-red-500/30 bg-black/50">
      <CardHeader>
        <CardTitle>Force Reset Presale State</CardTitle>
        <CardDescription>Reset the presale state by reversing isReleased and isPaused values.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-400 mb-4 space-y-2">
          <p>This will specifically reverse these values:</p>
          <div className="bg-gray-800/50 p-3 rounded-md font-mono text-xs">
            <div className="flex items-center">
              <span className="text-red-400">isReleased:</span>
              <span className="ml-2 text-green-400">true</span>
              <span className="mx-2">→</span>
              <span className="text-red-400">false</span>
            </div>
            <div className="flex items-center">
              <span className="text-red-400">isPaused:</span>
              <span className="ml-2 text-red-400">false</span>
              <span className="mx-2">→</span>
              <span className="text-green-400">true</span>
            </div>
          </div>
          <p>Use with caution. This action will bring back the release button and pause the presale.</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={handleReset} disabled={isLoading} className="w-full">
          {isLoading ? "Resetting..." : "Force Reset Presale State"}
        </Button>
      </CardFooter>
    </Card>
  )
}

