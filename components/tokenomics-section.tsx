import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Wallet, TrendingUp, Users, ShieldCheck, Lightbulb } from "lucide-react"

export function TokenomicsSection() {
  return (
    <section className="py-16">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Tokenomics</h2>
        <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed">
          The $MND token is designed with a sustainable and balanced economic model
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-400" />
              Token Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Presale</span>
                  <span>30%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[30%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">300,000,000 MND tokens</div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Team & Advisors</span>
                  <span>15%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Development</span>
                  <span>20%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[20%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Marketing</span>
                  <span>15%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[15%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Liquidity</span>
                  <span>10%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[10%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Reserve</span>
                  <span>10%</span>
                </div>
                <div className="h-2 w-full bg-purple-900/20 rounded-full overflow-hidden">
                  <div className="h-full w-[10%] bg-gradient-to-r from-purple-500 to-purple-700 rounded-full"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-purple-400" />
              Token Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-purple-900/20 pb-2">
                <span className="text-gray-400">Token Name</span>
                <span className="font-medium">Mindera AI</span>
              </div>
              <div className="flex justify-between border-b border-purple-900/20 pb-2">
                <span className="text-gray-400">Token Symbol</span>
                <span className="font-medium">$MND</span>
              </div>
              <div className="flex justify-between border-b border-purple-900/20 pb-2">
                <span className="text-gray-400">Total Supply</span>
                <span className="font-medium">1,000,000,000 MND</span>
              </div>
              <div className="flex justify-between border-b border-purple-900/20 pb-2">
                <span className="text-gray-400">Presale Allocation</span>
                <span className="font-medium">300,000,000 MND</span>
              </div>
              <div className="flex justify-between border-b border-purple-900/20 pb-2">
                <span className="text-gray-400">Token Type</span>
                <span className="font-medium">SPL Token</span>
              </div>
              <div className="flex justify-between border-b border-purple-900/20 pb-2">
                <span className="text-gray-400">Initial Price</span>
                <span className="font-medium">$0.0025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Launch Price</span>
                <span className="font-medium">$0.01</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader className="pb-2">
            <TrendingUp className="h-6 w-6 text-purple-400 mb-2" />
            <CardTitle className="text-base">Deflationary Model</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              1% of each transaction is burned, reducing supply over time and increasing scarcity.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader className="pb-2">
            <Users className="h-6 w-6 text-purple-400 mb-2" />
            <CardTitle className="text-base">Community Governance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              $MND token holders can vote on key platform decisions and future development.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader className="pb-2">
            <ShieldCheck className="h-6 w-6 text-purple-400 mb-2" />
            <CardTitle className="text-base">Vesting Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              Team tokens are locked for 12 months with a 24-month vesting period to ensure long-term commitment.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-700/30 bg-black/50">
          <CardHeader className="pb-2">
            <Lightbulb className="h-6 w-6 text-purple-400 mb-2" />
            <CardTitle className="text-base">Utility</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400">
              $MND tokens can be used for platform fees, staking rewards, and accessing premium features.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

