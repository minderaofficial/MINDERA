"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getPresaleState, releaseToken } from "@/actions/admin-actions"
import { Rocket } from "lucide-react"

export function ReleaseSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [isReleased, setIsReleased] = useState(true) // Default to true to hide button until we check
  const { toast } = useToast()

  // Fetch the current presale state when the component mounts
  useEffect(() => {
    const fetchPresaleState = async () => {
      try {
        const state = await getPresaleState()
        setIsReleased(state.isReleased)
      } catch (error) {
        console.error("Error fetching presale state:", error)
      }
    }

    fetchPresaleState()
  }, [])

  const handleRelease = async () => {
    if (!confirm("Are you sure you want to release the token? This action cannot be undone.")) {
      return
    }

    setIsLoading(true)
    try {
      const result = await releaseToken()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Token has been released successfully!",
        })
        setIsReleased(true)
      } else {
        throw new Error(result.error || "Failed to release token")
      }
    } catch (error) {
      console.error("Error releasing token:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to release token",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If the token is already released, don't show this section
  if (isReleased) {
    return null
  }

  return (
    <Card className="border-green-500/30 bg-black/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Rocket className="mr-2 h-5 w-5 text-green-400" />
          Release Token
        </CardTitle>
        <CardDescription>Release your token to make it available for trading.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400 mb-4">
          This action will finalize the presale and make your token available for trading. Once released, this action
          cannot be undone.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="default"
          onClick={handleRelease}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Releasing..." : "Release Token"}
        </Button>
      </CardFooter>
    </Card>
  )
}

