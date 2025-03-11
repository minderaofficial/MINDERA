import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, CreditCard, ArrowRight, CheckCircle } from "lucide-react"

export function HowItWorksSection() {
  return (
    <section className="py-16">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
        <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed">
          Participating in the Mindera AI presale is simple and secure
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-purple-900/20 flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-purple-400" />
            </div>
            <CardTitle>1. Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Connect your Solana wallet (Phantom, Solflare, etc.) to our presale platform.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-purple-900/20 flex items-center justify-center mb-4">
              <CreditCard className="h-6 w-6 text-purple-400" />
            </div>
            <CardTitle>2. Enter Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Decide how many tokens you want to purchase and enter the amount in SOL. The system automatically
              calculates the token amount based on current SOL price.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-purple-900/20 flex items-center justify-center mb-4">
              <ArrowRight className="h-6 w-6 text-purple-400" />
            </div>
            <CardTitle>3. Confirm Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Approve the transaction in your wallet and wait for confirmation on the blockchain.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader className="pb-2">
            <div className="w-12 h-12 rounded-full bg-purple-900/20 flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-purple-400" />
            </div>
            <CardTitle>4. Receive Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">
              Your tokens will be available for claim after the presale ends and the token launches.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 p-6 border border-purple-700/30 rounded-xl bg-black/50">
        <h3 className="text-xl font-bold mb-4">Important Information</h3>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-purple-400">•</span>
            </div>
            <p className="text-gray-400">Minimum purchase: 0.1 SOL</p>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-purple-400">•</span>
            </div>
            <p className="text-gray-400">Maximum purchase: 10 SOL per wallet</p>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-purple-400">•</span>
            </div>
            <p className="text-gray-400">
              Token price is fixed at $0.0025, but SOL amount is calculated based on current market price
            </p>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full bg-purple-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-purple-400">•</span>
            </div>
            <p className="text-gray-400">All transactions are final and non-refundable</p>
          </li>
        </ul>
      </div>
    </section>
  )
}

