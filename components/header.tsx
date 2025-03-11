"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletConnect } from "@/components/wallet-connect"
import { useWallet } from "@/context/wallet-context"
import { MobileMenu } from "@/components/mobile-menu"
import { Twitter, Send } from "lucide-react"

export function Header() {
  const { isConnected, connect, account } = useWallet()

  const handleBuyTokens = () => {
    const presaleSection = document.getElementById("presale")
    if (presaleSection) {
      presaleSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <header className="border-b border-purple-900/40 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-full bg-purple-600 blur-sm"></div>
            <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-purple-500 to-purple-800"></div>
          </div>
          <span className="text-xl font-bold">Mindera AI</span>
        </Link>

        <div className="md:hidden">
          <MobileMenu />
        </div>

        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:text-purple-400 transition-colors">
            Home
          </Link>
          <Link href="/?section=about" className="text-sm font-medium hover:text-purple-400 transition-colors">
            About
          </Link>
          <Link href="/?section=how-it-works" className="text-sm font-medium hover:text-purple-400 transition-colors">
            How It Works
          </Link>
          <Link href="/?section=tokenomics" className="text-sm font-medium hover:text-purple-400 transition-colors">
            Tokenomics
          </Link>
          <Link href="/?section=team" className="text-sm font-medium hover:text-purple-400 transition-colors">
            Team
          </Link>
          <Link href="/?section=faq" className="text-sm font-medium hover:text-purple-400 transition-colors">
            FAQ
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="https://x.com/aimindera"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-purple-400 transition-colors"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://t.me/+HWFrhB8Gwao3ODE1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-purple-400 transition-colors"
            >
              <Send className="h-4 w-4" />
            </a>
            {account === "946svTRVZa4KGU8NkvVSJwU9NkHdzr9Q5LFkhVHQUwdh" && (
              <Link
                href="/admin"
                className="px-3 py-1 bg-purple-700 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                Panel
              </Link>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <WalletConnect />
          {isConnected && (
            <Button className="bg-purple-700 text-white hover:bg-purple-600" onClick={handleBuyTokens}>
              Buy Tokens
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

