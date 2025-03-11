import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">Last Updated: March 11, 2025</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Mindera AI ("we," "our," or "us"). We respect your privacy and are committed to protecting your
            personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information
            when you use our website, services, or interact with our platform.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-lg font-medium mt-6 mb-3">2.1 Wallet Information</h3>
          <p>
            When you connect your wallet to our platform, we collect your public wallet address. We do not have access
            to your private keys, seed phrases, or other credentials that could be used to access your wallet.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">2.2 Transaction Information</h3>
          <p>
            We collect information about transactions you make on our platform, including token purchases, transfers,
            and other blockchain interactions. This information is publicly available on the blockchain and may include
            transaction hashes, wallet addresses, amounts, and timestamps.
          </p>

          <h3 className="text-lg font-medium mt-6 mb-3">2.3 Usage Information</h3>
          <p>We collect information about how you interact with our website and services, including:</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>IP address</li>
            <li>Device information</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and features used</li>
            <li>Time and date of visits</li>
            <li>Referring websites</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and verify their authenticity</li>
            <li>Communicate with you about our services, updates, and security alerts</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>Detect, prevent, and address technical issues, fraud, or illegal activities</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Blockchain Data</h2>
          <p>
            Please be aware that blockchain technology is inherently transparent and public. When you conduct
            transactions on the blockchain, your public wallet address and transaction details are publicly accessible.
            We cannot delete or modify this information as it is stored on the decentralized blockchain network.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to collect information about your browsing activities and
            to remember your preferences. You can instruct your browser to refuse all cookies or to indicate when a
            cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our
            service.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Data Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>Service providers who perform services on our behalf</li>
            <li>Business partners with whom we jointly offer products or services</li>
            <li>Law enforcement or other governmental authorities in response to a legal request</li>
            <li>Other parties in connection with a merger, sale, or acquisition</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information.
            However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot
            guarantee absolute security.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, such as:</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>The right to access the personal information we hold about you</li>
            <li>The right to request correction of inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to restrict or object to processing</li>
            <li>The right to data portability</li>
          </ul>
          <p>To exercise these rights, please contact us at privacy@minderaofficial.com.</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
            information from children. If you are a parent or guardian and believe your child has provided us with
            personal information, please contact us.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy
            Policy periodically for any changes.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">11. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p className="mt-2">Email: privacy@minderaofficial.com</p>
          <p>Address: Mindera AI, 123 Blockchain Street, Crypto City, CC 12345</p>

          <div className="mt-12 mb-8">
            <Link href="/" className="text-purple-400 hover:text-purple-300">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

