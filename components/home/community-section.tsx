import { Users, MessageSquare, FileCheck2, Briefcase } from 'lucide-react'
import { Container, CtaButton, SectionLabel } from '@/components/site-ui'
import { PixelFlame } from '@/components/pixel-flame'

const perks = [
  {
    icon: Users,
    title: 'Networking',
    detail: 'Meet 1,500+ peers and alumni across 55+ countries and every track.',
  },
  {
    icon: MessageSquare,
    title: 'Peer learning',
    detail: 'Study groups, accountability pods and live Q&A every week.',
  },
  {
    icon: FileCheck2,
    title: 'Resume reviews',
    detail: 'Get your CV and portfolio torn apart — kindly — before you apply.',
  },
  {
    icon: Briefcase,
    title: 'Job discussions',
    detail: 'A live feed of roles, referrals and interview debriefs.',
  },
]

export function CommunitySection() {
  return (
    <section className="border-b border-border py-20 sm:py-28" id="community">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel>Community</SectionLabel>
            <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              You will never job-hunt alone.
            </h2>
            <p className="mt-4 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground">
              Every Uptrail learner joins our private Discord — a living network
              of mentors, peers and alumni who have been exactly where you are.
            </p>
            <div className="mt-8">
              <CtaButton href="/community" variant="dark">
                Explore the community
              </CtaButton>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <perk.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{perk.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {perk.detail}
                </p>
              </div>
            ))}
            <div className="sm:col-span-2">
              <PixelFlame rows={4} cols={28} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
