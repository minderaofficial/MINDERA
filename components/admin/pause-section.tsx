"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getPresaleState, togglePauseState } from "@/actions/admin-actions"
import { Pause, Play } from "lucide-react"

export function PauseSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const { toast } = useToast()

  // Fetch the current presale state when the component mounts
  useEffect(() => {
    const fetchPresaleState = async () => {
      try {
        const state = await getPresaleState()
        setIsPaused(state.isPaused)
      } catch (error) {
        console.error("Error fetching presale state:", error)
      }
    }

    fetchPresaleState()
  }, [])

  const handleTogglePause = async () => {
    const action = isPaused ? "unpause" : "pause"
    if (!confirm(`Are you sure you want to ${action} the presale?`)) {
      return
    }

    setIsLoading(true)
    try {
      const result = await togglePauseState()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        setIsPaused(result.isPaused)
      } else {
        throw new Error(result.error || `Failed to ${action} presale`)
      }
    } catch (error) {
      console.error(`Error ${isPaused ? "unpausing" : "pausing"} presale:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${action} presale`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-yellow-500/30 bg-black/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isPaused ? (
            <Play className="mr-2 h-5 w-5 text-green-400" />
          ) : (
            <Pause className="mr-2 h-5 w-5 text-yellow-400" />
          )}
          {isPaused ? "Resume Presale" : "Pause Presale"}
        </CardTitle>
        <CardDescription>
          {isPaused
            ? "Resume the presale to allow users to participate again."
            : "Pause the presale to temporarily stop new contributions."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-4">
          Current status:{" "}
          <span className={isPaused ? "text-red-400" : "text-green-400"}>{isPaused ? "PAUSED" : "ACTIVE"}</span>
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant={isPaused ? "default" : "outline"}
          onClick={handleTogglePause}
          disabled={isLoading}
          className={`w-full ${
            isPaused ? "bg-green-600 hover:bg-green-700" : "border-yellow-500/50 text-yellow-400 hover:bg-yellow-950/30"
          }`}
        >
          {isLoading ? (isPaused ? "Resuming..." : "Pausing...") : isPaused ? "Resume Presale" : "Pause Presale"}
        </Button>
      </CardFooter>
    </Card>
  )
}

