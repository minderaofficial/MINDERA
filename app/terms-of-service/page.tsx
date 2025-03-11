import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">Last Updated: March 11, 2025</p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            Welcome to Mindera AI. These Terms of Service ("Terms") govern your access to and use of the Mindera AI
            website, platform, and services (collectively, the "Services"). By accessing or using our Services, you
            agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the
            Services.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Description of Services</h2>
          <p>
            Mindera AI is a decentralized blockchain platform that leverages artificial intelligence to create a more
            transparent, secure, and efficient ecosystem. Our Services include, but are not limited to, token presale,
            token distribution, and related blockchain functionalities.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Eligibility</h2>
          <p>
            To use our Services, you must be at least 18 years old and have the legal capacity to enter into a binding
            agreement. By using our Services, you represent and warrant that you meet these requirements.
          </p>
          <p className="mt-2">
            You are responsible for ensuring that your use of our Services complies with all laws, rules, and
            regulations applicable to you and in your jurisdiction. If your use of the Services is prohibited by
            applicable laws, then you are not authorized to use the Services.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. User Accounts and Wallet Connection</h2>
          <p>
            To access certain features of our Services, you may need to connect your cryptocurrency wallet. You are
            responsible for maintaining the security of your wallet, including your private keys, seed phrases, and
            passwords. We are not responsible for any loss or damage arising from your failure to maintain adequate
            security of your wallet credentials.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Token Presale and Purchases</h2>
          <p>The purchase of Mindera AI tokens ("$MND") during the presale is subject to the following conditions:</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>All token purchases are final and non-refundable.</li>
            <li>The price and availability of tokens may change without notice.</li>
            <li>We reserve the right to refuse service to anyone, at any time, for any reason.</li>
            <li>Token distribution will occur according to the schedule published on our website.</li>
            <li>Participation in the presale may be restricted in certain jurisdictions.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Risks</h2>
          <p>You acknowledge and agree that:</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>
              Cryptocurrency and blockchain technologies involve significant risks, including but not limited to, price
              volatility, technological vulnerabilities, and regulatory uncertainty.
            </li>
            <li>
              You are solely responsible for conducting your own research and due diligence before participating in our
              Services.
            </li>
            <li>
              We do not guarantee any returns or profits from your participation in our Services or from holding $MND
              tokens.
            </li>
            <li>
              The regulatory status of cryptocurrencies and blockchain technology is uncertain, and new regulations or
              policies may adversely affect the value of $MND tokens or the operation of the Mindera AI platform.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Prohibited Activities</h2>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-6 mt-2 mb-4 space-y-1">
            <li>Violating any applicable laws, regulations, or third-party rights</li>
            <li>Using the Services for any illegal purposes</li>
            <li>
              Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions
              to or from the servers running the Services
            </li>
            <li>Uploading or transmitting viruses, malware, or other malicious code</li>
            <li>Attempting to use automated systems, bots, or scripts to access the Services</li>
            <li>Impersonating another person or entity</li>
            <li>Engaging in market manipulation, fraud, or deceptive practices</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
          <p>
            All content, features, and functionality of our Services, including but not limited to text, graphics,
            logos, icons, images, audio clips, and software, are owned by Mindera AI or its licensors and are protected
            by copyright, trademark, and other intellectual property laws.
          </p>
          <p className="mt-2">
            You may not copy, modify, distribute, sell, or lease any part of our Services without our prior written
            consent.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">9. Disclaimers and Limitations of Liability</h2>
          <p>
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR
            IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
            PURPOSE, TITLE, AND NON-INFRINGEMENT.
          </p>
          <p className="mt-2">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MINDERA AI, ITS AFFILIATES, DIRECTORS,
            EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY
            DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE
            LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICES.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">10. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Mindera AI and its officers, directors, employees, and
            agents, from and against any claims, liabilities, damages, losses, and expenses, including, without
            limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to
            or use of the Services or your violation of these Terms.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard
            to its conflict of law principles. Any legal action or proceeding arising out of or relating to these Terms
            shall be exclusively brought in the courts of [Jurisdiction].
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by
            posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of the
            Services after any such changes constitutes your acceptance of the new Terms.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">13. Termination</h2>
          <p>
            We may terminate or suspend your access to the Services immediately, without prior notice or liability, for
            any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right
            to use the Services will immediately cease.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">14. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or
            eliminated to the minimum extent necessary so that the Terms will otherwise remain in full force and effect
            and enforceable.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">15. Contact Information</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p className="mt-2">Email: legal@minderaofficial.com</p>
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

