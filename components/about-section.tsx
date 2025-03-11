import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Lock, Zap, Globe } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-16">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Mindera AI</h2>
        <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed">
          Our decentralized platform combines the power of blockchain with artificial intelligence to create a more
          transparent, secure, and efficient ecosystem.
        </p>
      </div>

      <div className="grid gap-8">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                Mindera AI aims to revolutionize the blockchain industry by integrating advanced AI capabilities into a
                decentralized ecosystem. We're building a platform that empowers users with unprecedented transparency,
                security, and efficiency.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-700/30 bg-black/50">
            <CardHeader>
              <CardTitle>Core Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Database className="h-6 w-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Decentralized Infrastructure</h3>
                    <p className="text-sm text-gray-400">Fully decentralized network with no single point of failure</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Lock className="h-6 w-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Advanced Security</h3>
                    <p className="text-sm text-gray-400">AI-powered threat detection and prevention systems</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Zap className="h-6 w-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">High Performance</h3>
                    <p className="text-sm text-gray-400">
                      Scalable architecture handling millions of transactions per second
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Globe className="h-6 w-6 text-purple-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Global Accessibility</h3>
                    <p className="text-sm text-gray-400">Available worldwide with low barriers to entry</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

