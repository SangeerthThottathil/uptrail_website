import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Zap, CalendarClock, Target } from 'lucide-react'
import { Container, SectionLabel } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { ProgrammeCard } from '@/components/programme-card'
import { FinalCta } from '@/components/final-cta'
import { getProgrammes } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'Data, Business & Marketing Bootcamps UK | Uptrail',
  description:
    'Live online bootcamps in data analytics, business analysis and digital marketing. 3–6 weeks, expert mentors, real projects and 1:1 career coaching. Beginner friendly.',
}

const highlights = [
  {
    icon: Zap,
    title: 'Fast and focused',
    detail:
      'Intensive programmes that build one in-demand skill set in weeks, not months.',
  },
  {
    icon: CalendarClock,
    title: 'Fits around work',
    detail:
      'Live evening and weekend sessions designed for people already in a job.',
  },
  {
    icon: Target,
    title: 'Job-ready outcomes',
    detail:
      'Every bootcamp ends with a practical project you can take straight to interviews.',
  },
]

export default async function BootcampsPage() {
  const programmes = await getProgrammes()
  const bootcamps = programmes.filter((p) => p.track === 'bootcamp')

  return (
    <main>
      <PageHeader
        label="Bootcamps"
        title="Build an in-demand skill, fast."
        description="Short, intensive and mentor-led, our bootcamps focus on a single high-value skill set so you can upskill in weeks while keeping your current job."
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
            <SectionLabel>Explore bootcamps</SectionLabel>
            <Link
              href="/programmes"
              className="hidden items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent sm:flex"
            >
              Want a full career programme?
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bootcamps.map((programme) => (
              <ProgrammeCard key={programme.slug} programme={programme} />
            ))}
          </div>
        </div>
      </Container>

      <FinalCta
        title="Ready to upskill fast?"
        subtitle="Book a free 20-minute consultation and we'll help you pick the bootcamp that fits your goals and schedule."
      />
    </main>
  )
}
