"use client"

import { useState, useEffect } from "react"
import { useAdmin } from "@/context/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function PresaleManagement() {
  const { adminState, togglePresaleStatus, advanceStage, updateStageSettings, isLoading } = useAdmin()
  const { toast } = useToast()

  // Local state for form inputs
  const [stageSettings, setStageSettings] = useState<{
    [key: string]: { price: string; allocation: string }
  }>({})

  // Initialize local state from admin state
  useEffect(() => {
    const initialSettings = adminState.stages.reduce(
      (acc, stage) => {
        acc[`stage${stage.id}`] = {
          price: stage.price.toString(),
          allocation: stage.allocation.toString(),
        }
        return acc
      },
      {} as { [key: string]: { price: string; allocation: string } },
    )

    setStageSettings(initialSettings)
  }, [adminState.stages])

  const handleSaveSettings = () => {
    // Update all stages
    Object.entries(stageSettings).forEach(([stageKey, settings]) => {
      const stageId = Number.parseInt(stageKey.replace("stage", ""))
      updateStageSettings(stageId, {
        price: Number.parseFloat(settings.price),
        allocation: Number.parseInt(settings.allocation),
      })
    })

    toast({
      title: "Settings Saved",
      description: "Your presale settings have been updated.",
    })
  }

  const handleTogglePresale = () => {
    togglePresaleStatus()
    toast({
      title: adminState.presaleActive ? "Presale Paused" : "Presale Activated",
      description: adminState.presaleActive
        ? "The presale has been paused. Users cannot purchase tokens."
        : "The presale is now active. Users can purchase tokens.",
    })
  }

  const handleAdvanceStage = () => {
    if (adminState.currentStage < 3) {
      advanceStage()
      toast({
        title: "Stage Advanced",
        description: `Presale has been advanced to Stage ${adminState.currentStage + 1}.`,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Presale Management</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={adminState.presaleActive}
              onCheckedChange={handleTogglePresale}
              id="presale-active"
              disabled={isLoading}
            />
            <Label htmlFor="presale-active" className="cursor-pointer">
              {adminState.presaleActive ? "Active" : "Paused"}
            </Label>
          </div>
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
          <CardTitle>Current Status</CardTitle>
          <CardDescription>Overview of the presale status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Current Stage</h3>
              <p className="text-2xl font-bold">Stage {adminState.currentStage}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Current Price</h3>
              <p className="text-2xl font-bold">
                ${adminState.stages.find((s) => s.id === adminState.currentStage)?.price}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">Status</h3>
              <p className="text-2xl font-bold">{adminState.presaleActive ? "Active" : "Paused"}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t border-purple-700/30 pt-6">
          <Button
            variant="outline"
            className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
            onClick={handleTogglePresale}
            disabled={isLoading}
          >
            {adminState.presaleActive ? "Pause Presale" : "Activate Presale"}
          </Button>
          <Button
            className="bg-purple-700 text-white hover:bg-purple-600"
            onClick={handleAdvanceStage}
            disabled={adminState.currentStage >= 3 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Advance to Next Stage"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="stage1" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="stage1">Stage 1</TabsTrigger>
          <TabsTrigger value="stage2">Stage 2</TabsTrigger>
          <TabsTrigger value="stage3">Stage 3</TabsTrigger>
        </TabsList>

        {adminState.stages.map((stage) => {
          const stageKey = `stage${stage.id}`
          return (
            <TabsContent key={stage.id} value={stageKey}>
              <Card className="border-purple-700/30 bg-black/50">
                <CardHeader>
                  <CardTitle>Stage {stage.id}</CardTitle>
                  <CardDescription>Configure settings for this stage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${stageKey}-price`}>Token Price (USD)</Label>
                      <Input
                        id={`${stageKey}-price`}
                        value={stageSettings[stageKey]?.price || stage.price.toString()}
                        onChange={(e) =>
                          setStageSettings({
                            ...stageSettings,
                            [stageKey]: {
                              ...stageSettings[stageKey],
                              price: e.target.value,
                            },
                          })
                        }
                        className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${stageKey}-allocation`}>Token Allocation</Label>
                      <Input
                        id={`${stageKey}-allocation`}
                        value={stageSettings[stageKey]?.allocation || stage.allocation.toString()}
                        onChange={(e) =>
                          setStageSettings({
                            ...stageSettings,
                            [stageKey]: {
                              ...stageSettings[stageKey],
                              allocation: e.target.value,
                            },
                          })
                        }
                        className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-purple-900/10 rounded-lg border border-purple-700/20">
                    <h4 className="font-medium mb-2">Stage Status</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tokens Sold</span>
                        <span>{stage.sold.toLocaleString()} MND</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Remaining</span>
                        <span>{(stage.allocation - stage.sold).toLocaleString()} MND</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Active</span>
                        <span>{stage.active ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Progress</span>
                        <span>{((stage.sold / stage.allocation) * 100).toFixed(2)}%</span>
                      </div>
                    </div>

                    <div className="mt-4 h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
                        style={{ width: `${(stage.sold / stage.allocation) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>

      <div className="flex justify-end">
        <Button
          className="bg-purple-700 text-white hover:bg-purple-600"
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save All Settings"
          )}
        </Button>
      </div>
    </div>
  )
}

