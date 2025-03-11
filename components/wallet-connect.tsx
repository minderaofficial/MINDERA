"use client"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/context/wallet-context"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function WalletConnect() {
  const { connect, disconnect, account, isConnecting } = useWallet()
  const { toast } = useToast()

  const handleConnect = async () => {
    try {
      await connect()
    } catch (error: any) {
      // Error is already handled in the wallet context
    }
  }

  // Check if wallet is installed
  const isWalletInstalled = () => {
    if (typeof window === "undefined") return false
    return !!(window.phantom?.solana || window.solflare || window.solana)
  }

  return (
    <div>
      {account ? (
        <Button
          variant="outline"
          className="border-purple-700 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
          onClick={disconnect}
        >
          {account.slice(0, 6)}...{account.slice(-4)}
        </Button>
      ) : (
        <Button
          variant="outline"
          className="border-purple-700 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300"
          onClick={handleConnect}
          disabled={isConnecting}
          aria-label="Connect Wallet"
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      )}

      {!isWalletInstalled() && !account && (
        <p className="text-xs text-red-400 mt-2">
          No Solana wallet detected. Please install{" "}
          <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" className="underline">
            Phantom
          </a>{" "}
          or{" "}
          <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer" className="underline">
            Solflare
          </a>
        </p>
      )}
    </div>
  )
}

