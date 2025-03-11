"use client"

import { useWallet } from "@/context/wallet-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function DebugPage() {
  const { account, connect, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)

  const ADMIN_WALLET = "946svTRVZa4KGU8NkvVSJwU9NkHdzr9Q5LFkhVHQUwdh"

  const copyWallet = () => {
    navigator.clipboard.writeText(ADMIN_WALLET)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Wallet Debug Page</h1>

      <div className="bg-gray-900 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Connected Wallet</h2>
        {account ? (
          <div>
            <p className="mb-2">
              Address: <span className="font-mono bg-black p-1 rounded">{account}</span>
            </p>
            <p className="mb-4">
              Is Admin:{" "}
              <span className={account === ADMIN_WALLET ? "text-green-500" : "text-red-500"}>
                {account === ADMIN_WALLET ? "Yes" : "No"}
              </span>
            </p>
            <Button onClick={disconnect} variant="outline" className="mr-4">
              Disconnect
            </Button>
            <Link href="/admin">
              <Button>Try Admin Access</Button>
            </Link>
          </div>
        ) : (
          <div>
            <p className="mb-4">No wallet connected</p>
            <Button onClick={connect}>Connect Wallet</Button>
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Admin Wallet Information</h2>
        <p className="mb-2">Admin Wallet Address:</p>
        <div className="flex items-center mb-4">
          <code className="font-mono bg-black p-2 rounded flex-1 overflow-auto">{ADMIN_WALLET}</code>
          <Button onClick={copyWallet} variant="outline" className="ml-2">
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <p className="text-sm text-gray-400">
          Make sure you connect with exactly this wallet address to access the admin panel.
        </p>
      </div>

      <div className="mt-8">
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    </div>
  )
}

