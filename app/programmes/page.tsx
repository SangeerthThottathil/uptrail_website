import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Briefcase, Users, Trophy } from 'lucide-react'
import { Container, SectionLabel } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { ProgrammeCard } from '@/components/programme-card'
import { FinalCta } from '@/components/final-cta'
import { getProgrammes } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'Career Programmes — Uptrail',
  description:
    'In-depth, mentor-led career programmes that take you from beginner to job-ready, complete with a portfolio and dedicated career coaching.',
}

const highlights = [
  {
    icon: Briefcase,
    title: 'Built for a career change',
    detail:
      'Longer, deeper programmes designed to take you all the way from foundations to your first role in the field.',
  },
  {
    icon: Users,
    title: 'Weekly mentor support',
    detail:
      'Live sessions and one-to-one feedback from practitioners who work in the industry today.',
  },
  {
    icon: Trophy,
    title: 'Career coaching included',
    detail:
      'CV reviews, mock interviews and salary negotiation until you land the offer you want.',
  },
]

export default async function ProgrammesPage() {
  const programmes = await getProgrammes()
  const careerProgrammes = programmes.filter((p) => p.track === 'career')

  return (
    <main>
      <PageHeader
        label="Career Programmes"
        title="Change careers with confidence."
        description="Our flagship programmes run over several months, pairing live mentor-led teaching with real projects and dedicated career coaching — everything you need to switch into a new field."
      />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-3">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <h.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">
                {h.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {h.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between">
            <SectionLabel>Explore career programmes</SectionLabel>
            <Link
              href="/bootcamps"
              className="hidden items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent sm:flex"
            >
              Looking for a shorter bootcamp?
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {careerProgrammes.map((programme) => (
              <ProgrammeCard key={programme.slug} programme={programme} />
            ))}
          </div>
        </div>
      </Container>

      <FinalCta
        title="Ready to switch careers?"
        subtitle="Book a free 20-minute consultation and our career team will help you choose the right programme for your goals."
      />
    </main>
  )
}
