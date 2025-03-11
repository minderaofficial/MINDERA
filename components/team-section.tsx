import { Card, CardContent } from "@/components/ui/card"
import { Linkedin } from "lucide-react"
import Image from "next/image"

interface TeamMember {
  name: string
  role: string
  title: string
  image: string
  linkedin: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Simon Steer",
    role: "CEO",
    title: "Cert CII Client Director",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-IL7iXUWKhP8ItzVuY9lARexhLChO1x.png",
    linkedin: "https://www.linkedin.com/in/simon-steer-cert-cii-306836173/",
  },
  {
    name: "Nick Taylor-Ward",
    role: "CTO",
    title: "ACII Chartered Insurance Broker - Client Director",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pnDjXlnJkuZ2wQBcqqel8r5tcB0I6I.png",
    linkedin: "https://www.linkedin.com/in/nick-taylor-ward-insurance/",
  },
]

export function TeamSection() {
  return (
    <section className="py-16" id="team">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Leadership Team</h2>
        <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed">
          Meet the experienced professionals leading Mindera AI
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        {teamMembers.map((member) => (
          <Card key={member.name} className="border-purple-700/30 bg-black/50 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                  <p className="text-purple-400 font-medium mb-1">{member.role}</p>
                  <p className="text-sm text-gray-400 mb-3">{member.title}</p>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>View Profile</span>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

