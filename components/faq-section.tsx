"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqItems: FaqItem[] = [
    {
      question: "What is Mindera AI?",
      answer:
        "Mindera AI is a decentralized blockchain platform that leverages artificial intelligence to create a more transparent, secure, and efficient ecosystem for users. Our platform combines cutting-edge AI technology with blockchain to solve real-world problems.",
    },
    {
      question: "How can I participate in the presale?",
      answer:
        "To participate in the presale, you need to connect your Solana wallet (like Phantom or Solflare), enter the amount of SOL you want to contribute, and confirm the transaction. The minimum contribution is 0.1 SOL and the maximum is 10 SOL per wallet.",
    },
    {
      question: "When will I receive my $MND tokens?",
      answer:
        "$MND tokens will be available for claim after the presale ends and the token officially launches. You'll be able to claim your tokens through our platform by connecting the same wallet you used for the contribution.",
    },
    {
      question: "Is there a vesting period for presale participants?",
      answer:
        "No, there is no vesting period for presale participants. You will receive your full allocation of tokens once the token launches. However, team and advisor tokens are subject to a vesting schedule to ensure long-term commitment.",
    },
    {
      question: "What blockchain is Mindera AI built on?",
      answer:
        "Mindera AI is built on the Solana blockchain, leveraging its high speed, low transaction costs, and energy efficiency. This allows us to provide a seamless and cost-effective experience for our users.",
    },
    {
      question: "How is Mindera AI different from other AI blockchain projects?",
      answer:
        "Mindera AI differentiates itself through its unique integration of AI for security, governance, and scalability. Our platform uses AI to optimize transaction processing, detect potential threats, and provide data-driven insights for governance decisions.",
    },
    {
      question: "What happens if the presale doesn't reach its soft cap?",
      answer:
        "If the presale doesn't reach its soft cap, contributors will be able to claim a refund of their contribution. We have implemented a secure refund mechanism in our smart contract to ensure all funds are safely returned if the soft cap isn't met.",
    },
    {
      question: "Where can I find more information about the project?",
      answer:
        "You can find more information about Mindera AI in our whitepaper, on our X account (@aimindera), and in our community forums. You can also contact us directly at contact@minderaofficial.com for any specific questions.",
    },
  ]

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
        <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed">
          Find answers to common questions about Mindera AI and our presale
        </p>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {faqItems.map((item, index) => (
          <Card
            key={index}
            className={`border-purple-700/30 bg-black/50 transition-all ${openIndex === index ? "ring-1 ring-purple-500" : ""}`}
          >
            <CardHeader className="cursor-pointer py-4" onClick={() => toggleFaq(index)}>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{item.question}</CardTitle>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-purple-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-purple-400" />
                )}
              </div>
            </CardHeader>
            {openIndex === index && (
              <CardContent className="pt-0 pb-4">
                <p className="text-gray-400">{item.answer}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-400">
          Still have questions? Contact us at{" "}
          <a href="mailto:contact@minderaofficial.com" className="text-purple-400 hover:underline">
            contact@minderaofficial.com
          </a>
        </p>
      </div>
    </section>
  )
}

