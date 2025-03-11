"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white hover:bg-purple-900/20">
        <Menu className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="flex justify-end p-4">
            <Button variant="ghost" size="icon" onClick={closeMenu} className="text-white hover:bg-purple-900/20">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex flex-col items-center justify-center flex-1 gap-8">
            <Link href="/" className="text-xl font-medium hover:text-purple-400 transition-colors" onClick={closeMenu}>
              Home
            </Link>
            <Link
              href="/?section=about"
              className="text-xl font-medium hover:text-purple-400 transition-colors"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              href="/?section=how-it-works"
              className="text-xl font-medium hover:text-purple-400 transition-colors"
              onClick={closeMenu}
            >
              How It Works
            </Link>
            <Link
              href="/?section=tokenomics"
              className="text-xl font-medium hover:text-purple-400 transition-colors"
              onClick={closeMenu}
            >
              Tokenomics
            </Link>
            <Link
              href="/?section=team"
              className="text-xl font-medium hover:text-purple-400 transition-colors"
              onClick={closeMenu}
            >
              Team
            </Link>
            <Link
              href="/?section=faq"
              className="text-xl font-medium hover:text-purple-400 transition-colors"
              onClick={closeMenu}
            >
              FAQ
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}

