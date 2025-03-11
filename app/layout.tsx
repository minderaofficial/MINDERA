import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { WalletProvider } from "@/context/wallet-context"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { PresaleProvider } from "@/context/presale-context"
import { AdminProvider } from "@/context/admin-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mindera AI Presale",
  description:
    "Join the Mindera AI presale to secure MIND tokens at the lowest possible price before our public launch.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <WalletProvider>
            <PresaleProvider>
              <AdminProvider>
                {children}
                <Toaster />
              </AdminProvider>
            </PresaleProvider>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'