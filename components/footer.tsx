import Link from "next/link"
import { Twitter, Globe, Send } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-purple-900/40 bg-black py-8">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-full bg-purple-600 blur-sm"></div>
                <div className="absolute inset-0.5 rounded-full bg-gradient-to-br from-purple-500 to-purple-800"></div>
              </div>
              <span className="text-xl font-bold">Mindera AI</span>
            </Link>
            <p className="text-sm text-gray-400">
              A decentralized blockchain platform leveraging AI for unprecedented transparency, security, and
              efficiency.
            </p>
            <div className="flex gap-2">
              <Link
                href="https://x.com/aimindera"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-purple-900/20 p-2 text-purple-400 hover:bg-purple-900/40 hover:text-purple-300"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://t.me/+HWFrhB8Gwao3ODE1"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-purple-900/20 p-2 text-purple-400 hover:bg-purple-900/40 hover:text-purple-300"
              >
                <Send className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="rounded-full bg-purple-900/20 p-2 text-purple-400 hover:bg-purple-900/40 hover:text-purple-300"
              >
                <Globe className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/?section=about" className="text-gray-400 hover:text-purple-400">
                  About
                </Link>
              </li>
              <li>
                <Link href="/?section=how-it-works" className="text-gray-400 hover:text-purple-400">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/?section=tokenomics" className="text-gray-400 hover:text-purple-400">
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link href="/?section=faq" className="text-gray-400 hover:text-purple-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:contact@minderaofficial.com" className="text-gray-400 hover:text-purple-400">
                  contact@minderaofficial.com
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/aimindera"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400"
                >
                  @aimindera
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/+HWFrhB8Gwao3ODE1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400"
                >
                  Telegram Community
                </a>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-purple-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-purple-900/40 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Mindera AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

