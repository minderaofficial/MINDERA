"use client"

import { PresaleDashboard } from "@/components/presale-dashboard"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutSection } from "@/components/about-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { TokenomicsSection } from "@/components/tokenomics-section"
import { FaqSection } from "@/components/faq-section"
import { TeamSection } from "@/components/team-section"
import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)
  const tokenomicsRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const faqRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  // Handle scroll to section based on URL hash
  useEffect(() => {
    const hash = searchParams.get("section")
    if (hash) {
      const targetRef = {
        about: aboutRef,
        "how-it-works": howItWorksRef,
        tokenomics: tokenomicsRef,
        team: teamRef,
        faq: faqRef,
      }[hash]

      if (targetRef?.current) {
        targetRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [searchParams])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-12">
        <PresaleDashboard />

        <div ref={aboutRef} id="about" className="scroll-mt-20">
          <AboutSection />
        </div>

        <div ref={howItWorksRef} id="how-it-works" className="scroll-mt-20">
          <HowItWorksSection />
        </div>

        <div ref={tokenomicsRef} id="tokenomics" className="scroll-mt-20">
          <TokenomicsSection />
        </div>

        <div ref={teamRef} id="team" className="scroll-mt-20">
          <TeamSection />
        </div>

        <div ref={faqRef} id="faq" className="scroll-mt-20">
          <FaqSection />
        </div>
      </div>
      <Footer />
    </main>
  )
}

