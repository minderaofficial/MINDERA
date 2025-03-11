"use client"

import { useState } from "react"
import { useAdmin } from "@/context/admin-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const { adminState, updateSettings, isLoading } = useAdmin()
  const { toast } = useToast()

  // Local state for form values
  const [settings, setSettings] = useState({ ...adminState.settings })
  const [adminEmail, setAdminEmail] = useState("")
  const [ipAddress, setIpAddress] = useState("")

  // Handle save settings
  const handleSaveSettings = () => {
    updateSettings(settings)

    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    })
  }

  // Add admin email
  const handleAddAdminEmail = () => {
    if (!adminEmail || !adminEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (settings.adminEmails.includes(adminEmail)) {
      toast({
        title: "Email Already Exists",
        description: "This email is already in the list.",
        variant: "destructive",
      })
      return
    }

    setSettings({
      ...settings,
      adminEmails: [...settings.adminEmails, adminEmail],
    })

    setAdminEmail("")
  }

  // Remove admin email
  const handleRemoveAdminEmail = (email: string) => {
    setSettings({
      ...settings,
      adminEmails: settings.adminEmails.filter((e) => e !== email),
    })
  }

  // Add IP address
  const handleAddIpAddress = () => {
    // Simple IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/

    if (!ipAddress || !ipRegex.test(ipAddress)) {
      toast({
        title: "Invalid IP Address",
        description: "Please enter a valid IP address.",
        variant: "destructive",
      })
      return
    }

    if (settings.allowedIPs.includes(ipAddress)) {
      toast({
        title: "IP Already Exists",
        description: "This IP address is already in the list.",
        variant: "destructive",
      })
      return
    }

    setSettings({
      ...settings,
      allowedIPs: [...settings.allowedIPs, ipAddress],
    })

    setIpAddress("")
  }

  // Remove IP address
  const handleRemoveIpAddress = (ip: string) => {
    setSettings({
      ...settings,
      allowedIPs: settings.allowedIPs.filter((i) => i !== ip),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button
          variant="outline"
          className="border-purple-700/30 text-purple-400 hover:bg-purple-900/20"
          onClick={() => window.history.back()}
        >
          Back
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general presale settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="min-buy-in">Minimum Buy-in (SOL)</Label>
                  <Input
                    id="min-buy-in"
                    type="number"
                    step="0.01"
                    value={settings.minBuyIn}
                    onChange={(e) => setSettings({ ...settings, minBuyIn: Number.parseFloat(e.target.value) })}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-400">Minimum amount of SOL required for purchase</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-buy-in">Maximum Buy-in (SOL)</Label>
                  <Input
                    id="max-buy-in"
                    type="number"
                    step="0.1"
                    value={settings.maxBuyIn}
                    onChange={(e) => setSettings({ ...settings, maxBuyIn: Number.parseFloat(e.target.value) })}
                    className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-400">Maximum amount of SOL allowed per wallet</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral-reward">Referral Reward (%)</Label>
                <Input
                  id="referral-reward"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={settings.referralReward}
                  onChange={(e) => setSettings({ ...settings, referralReward: Number.parseFloat(e.target.value) })}
                  className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-400">Percentage reward for referrals</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode" className="block mb-1">
                      Maintenance Mode
                    </Label>
                    <p className="text-xs text-gray-400">Temporarily disable the presale page</p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="whitelist-only" className="block mb-1">
                      Whitelist Only
                    </Label>
                    <p className="text-xs text-gray-400">Restrict purchases to whitelisted wallets</p>
                  </div>
                  <Switch
                    id="whitelist-only"
                    checked={settings.whitelistOnly}
                    onCheckedChange={(checked) => setSettings({ ...settings, whitelistOnly: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-purple-700/30 pt-6">
              <Button
                className="bg-purple-700 text-white hover:bg-purple-600 ml-auto"
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emergency-mode" className="block mb-1">
                      Emergency Mode
                    </Label>
                    <p className="text-xs text-gray-400">Enable emergency mode (pauses all transactions)</p>
                  </div>
                  <Switch
                    id="emergency-mode"
                    checked={settings.emergencyMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, emergencyMode: checked })}
                  />
                </div>

                {settings.emergencyMode && (
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-400">Warning: Emergency Mode Active</h3>
                      <p className="text-sm text-red-300/80 mt-1">
                        Emergency mode is currently active. All transactions are paused and liquidity pools are
                        unlocked.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="ip-restrictions" className="block mb-1">
                      IP Restrictions
                    </Label>
                    <p className="text-xs text-gray-400">Restrict admin access to specific IP addresses</p>
                  </div>
                  <Switch
                    id="ip-restrictions"
                    checked={settings.ipRestrictions}
                    onCheckedChange={(checked) => setSettings({ ...settings, ipRestrictions: checked })}
                  />
                </div>

                {settings.ipRestrictions && (
                  <div className="space-y-4 mt-4 p-4 border border-purple-700/30 rounded-lg">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter IP address"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <Button onClick={handleAddIpAddress} className="bg-purple-700 text-white hover:bg-purple-600">
                        Add IP
                      </Button>
                    </div>

                    {settings.allowedIPs.length > 0 ? (
                      <div className="space-y-2">
                        <Label>Allowed IP Addresses</Label>
                        <div className="space-y-2">
                          {settings.allowedIPs.map((ip) => (
                            <div key={ip} className="flex justify-between items-center p-2 bg-purple-900/10 rounded-md">
                              <span className="font-mono">{ip}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                onClick={() => handleRemoveIpAddress(ip)}
                              >
                                &times;
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No IP addresses added yet</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-purple-700/30 pt-6">
              <Button
                className="bg-purple-700 text-white hover:bg-purple-600 ml-auto"
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="block mb-1">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-gray-400">Receive email notifications for important events</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              {settings.emailNotifications && (
                <div className="space-y-4 mt-4 p-4 border border-purple-700/30 rounded-lg">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter admin email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="border-purple-700/30 bg-black/50 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <Button onClick={handleAddAdminEmail} className="bg-purple-700 text-white hover:bg-purple-600">
                      Add Email
                    </Button>
                  </div>

                  {settings.adminEmails.length > 0 ? (
                    <div className="space-y-2">
                      <Label>Admin Email Addresses</Label>
                      <div className="space-y-2">
                        {settings.adminEmails.map((email) => (
                          <div
                            key={email}
                            className="flex justify-between items-center p-2 bg-purple-900/10 rounded-md"
                          >
                            <span>{email}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                              onClick={() => handleRemoveAdminEmail(email)}
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No admin emails added yet</p>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-purple-700/30 pt-6">
              <Button
                className="bg-purple-700 text-white hover:bg-purple-600 ml-auto"
                onClick={handleSaveSettings}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

