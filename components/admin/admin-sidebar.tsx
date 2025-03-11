import Link from "next/link"
import { LayoutDashboard, Coins, Settings, Users, FileText, BarChart3, Code, UserCheck, Send } from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Presale Management",
    href: "/admin/presale",
    icon: Coins,
  },
  {
    title: "Token Distribution",
    href: "/admin/tokens",
    icon: Users,
  },
  {
    title: "Token Holders",
    href: "/admin/holders",
    icon: UserCheck,
  },
  {
    title: "Token Airdrop",
    href: "/admin/airdrop",
    icon: Send,
  },
  {
    title: "Contract Management",
    href: "/admin/contract",
    icon: Code,
  },
  {
    title: "Liquidity Management",
    href: "/admin/liquidity",
    icon: BarChart3,
  },
  {
    title: "Transactions",
    href: "/admin/transactions",
    icon: FileText,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  return (
    <div className="w-64 border-r border-purple-900/40 bg-black/80 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-full bg-purple-600 blur-sm"></div>
          <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-purple-500 to-purple-800"></div>
        </div>
        <span className="text-xl font-bold">Mindera Admin</span>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-900/20 transition-colors"
          >
            <item.icon className="h-5 w-5 text-purple-400" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

