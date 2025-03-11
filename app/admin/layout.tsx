"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { useWallet } from "@/context/wallet-context"
import NotFound from "./not-found"

// Admin wallet address
const ADMIN_WALLET = "946svTRVZa4KGU8NkvVSJwU9NkHdzr9Q5LFkhVHQUwdh"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { account } = useWallet()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Just to ensure the component has mounted
    setIsLoading(false)
  }, [])

  // Show loading state
  if (isLoading) {
    return <div className="flex min-h-screen bg-black items-center justify-center">Loading...</div>
  }

  // Check if wallet is connected and matches admin wallet
  const isAuthorized = account === ADMIN_WALLET

  // Show not found for unauthorized users
  if (!isAuthorized) {
    return <NotFound />
  }

  // Render admin layout for authorized users
  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}

