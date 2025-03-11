"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { launchToken } from "@/actions/admin-actions"
import { ExternalLink } from "lucide-react"

export function LaunchSection() {
  const [isLoading, setIsLoading] = useState(false)
  const [telegramLink, setTelegramLink] = useState<string | null>(null)
  const { toast } = useToast()

  const handleLaunch = async (formData: FormData) => {
    setIsLoading(true)
    try {
      const result = await launchToken(formData)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        if (result.telegramLink) {
          setTelegramLink(result.telegramLink)
        }
      } else {
        throw new Error(result.error || "Failed to launch token")
      }
    } catch (error) {
      console.error("Error launching token:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to launch token",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-green-500/30 bg-black/50">
      <CardHeader>
        <CardTitle>Launch Token</CardTitle>
        <CardDescription>Launch your token and create a Telegram CTO announcement.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleLaunch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contractAddress">Contract Address (CA)</Label>
            <Input id="contractAddress" name="contractAddress" placeholder="0x..." required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tokenName">Token Name</Label>
            <Input id="tokenName" name="tokenName" placeholder="Mindera AI" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tokenSymbol">Token Symbol</Label>
            <Input id="tokenSymbol" name="tokenSymbol" placeholder="MIND" required />
          </div>

          <Button
            type="submit"
            variant="default"
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Launching..." : "Launch Token & Create Telegram CTO"}
          </Button>
        </form>

        {telegramLink && (
          <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-md">
            <p className="text-sm font-medium text-green-400 mb-2">Telegram CTO created successfully!</p>
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-400 hover:text-blue-300"
            >
              {telegramLink} <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

