"use client"
import { usePresale } from "@/context/presale-context"
import { Loader2 } from "lucide-react"

export function PresaleStats() {
  const { presaleData, isLoading } = usePresale()

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg bg-purple-900/10 p-4 border border-purple-700/20">
          <div className="text-sm text-gray-400">Current Price</div>
          <div className="text-2xl font-bold">${presaleData.currentPrice}</div>
          <div className="text-xs text-purple-400">75% discount from launch price</div>
        </div>
        <div className="rounded-lg bg-purple-900/10 p-4 border border-purple-700/20">
          <div className="text-sm text-gray-400">Raised So Far</div>
          <div className="text-2xl font-bold">
            ${presaleData.raisedAmount.toLocaleString()} / ${presaleData.hardCap.toLocaleString()}
          </div>
          <div className="text-xs text-purple-400">{presaleData.percentageRaised}% of hard cap reached</div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <div className="flex items-center">
            {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin text-purple-400" />}
            <span>{presaleData.percentageRaised}%</span>
          </div>
        </div>
        <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${presaleData.percentageRaised}%` }}
          ></div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="p-3 rounded-lg bg-purple-900/10 border border-purple-700/20">
          <div className="text-sm text-gray-400 mb-1">Token Allocation</div>
          <div className="flex justify-between items-center">
            <div className="text-base font-medium">
              {presaleData.totalTokensSold.toLocaleString()} / 300,000,000 MND
            </div>
          </div>
          <div className="h-1.5 w-full bg-purple-900/20 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"
              style={{ width: `${(presaleData.totalTokensSold / 300000000) * 100}%` }}
            ></div>
          </div>
        </div>

        {presaleData.solanaPrice && (
          <div className="p-3 rounded-lg bg-purple-900/10 border border-purple-700/20">
            <div className="text-sm text-gray-400 mb-1">SOL Price</div>
            <div className="flex justify-between items-center">
              <div className="text-base font-medium">${presaleData.solanaPrice.usd.toFixed(2)}</div>
              <div className="text-sm">
                24h:
                {presaleData.solanaPrice.usd_24h_change > 0 ? (
                  <span className="ml-1 text-green-500">+{presaleData.solanaPrice.usd_24h_change.toFixed(2)}%</span>
                ) : (
                  <span className="ml-1 text-red-500">{presaleData.solanaPrice.usd_24h_change.toFixed(2)}%</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

