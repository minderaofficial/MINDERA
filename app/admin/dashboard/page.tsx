import { ForceResetSection } from "@/components/admin/force-reset-section"
import { LiquiditySection } from "@/components/admin/liquidity-section"
import { LaunchSection } from "@/components/admin/launch-section"
import { ReleaseSection } from "@/components/admin/release-section"
import { PauseSection } from "@/components/admin/pause-section"
import { AdminHeader } from "@/components/admin/admin-header"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default function AdminDashboard() {
  // Check admin authentication
  const adminPassword = process.env.ADMIN_PASSWORD
  const storedPassword = cookies().get("admin_auth")?.value

  if (!adminPassword || storedPassword !== adminPassword) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminHeader />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Release Section - This will only show when isReleased is false */}
          <div className="md:col-span-2">
            <ReleaseSection />
          </div>

          {/* Pause/Resume Section */}
          <PauseSection />

          {/* Launch Section */}
          <LaunchSection />

          {/* Liquidity Management */}
          <LiquiditySection />

          {/* Other admin sections would go here */}

          {/* Force Reset Section - Placed at the bottom as it's a dangerous action */}
          <div className="md:col-span-2">
            <ForceResetSection />
          </div>
        </div>
      </main>
    </div>
  )
}

