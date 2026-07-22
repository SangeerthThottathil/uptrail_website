import type { Metadata } from 'next'
import {
  Users,
  MessageCircle,
  CalendarDays,
  Globe,
  Heart,
  Trophy,
} from 'lucide-react'
import { Container, SectionLabel } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { FinalCta } from '@/components/final-cta'
import { getStats } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'Community | Uptrail',
  description:
    'Learn alongside a global community of career switchers, mentors and alumni who support each other long after graduation.',
}

const pillars = [
  {
    icon: MessageCircle,
    title: 'Always-on study channels',
    body: 'Dedicated channels for every cohort and discipline, where questions get answered in minutes, not days.',
  },
  {
    icon: CalendarDays,
    title: 'Weekly live events',
    body: 'Office hours, guest talks from industry leaders and hands-on workshops run every week of the year.',
  },
  {
    icon: Users,
    title: 'Small accountable cohorts',
    body: 'You progress with a group of peers who start when you start, so nobody gets left behind.',
  },
  {
    icon: Globe,
    title: 'A global network',
    body: 'Learners from 55+ countries means feedback, perspectives and connections from every corner of the world.',
  },
  {
    icon: Heart,
    title: 'Mentor matching',
    body: 'Every learner is paired with a working professional who reviews your projects and career plan.',
  },
  {
    icon: Trophy,
    title: 'Lifelong alumni access',
    body: 'Keep your community membership, events and job board access forever after you graduate.',
  },
]

const events = [
  {
    day: 'Mon',
    title: 'Mentor office hours',
    detail: 'Drop-in support across all programmes.',
  },
  {
    day: 'Wed',
    title: 'Industry guest talk',
    detail: 'A practitioner shares how the work really happens.',
  },
  {
    day: 'Thu',
    title: 'Portfolio review night',
    detail: 'Get live feedback on your capstone projects.',
  },
  {
    day: 'Sat',
    title: 'Hiring partner AMA',
    detail: 'Ask recruiters what they actually look for.',
  },
]

export default async function CommunityPage() {
  const stats = await getStats()
  return (
    <>
      <PageHeader
        label="Community"
        title="You never learn alone at Uptrail."
        description="The hardest part of changing careers is staying motivated. Our community is built so there is always someone a message away — mentors, peers and alumni who have been exactly where you are."
      />

      {/* Stats band */}
      <section className="border-b border-border">
        <Container className="grid grid-cols-2 gap-px overflow-hidden md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-2 py-10 text-center">
              <div className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* Pillars */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-24">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Support that is designed in, not bolted on.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div key={p.title} className="bg-background p-7">
                <div className="flex size-11 items-center justify-center rounded-md bg-secondary text-foreground">
                  <p.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Weekly rhythm */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <SectionLabel>A typical week</SectionLabel>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Something happening every few days.
              </h2>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
                Live events are recorded so you can catch up if life gets in the
                way, but most learners say turning up live is what keeps them on
                track.
              </p>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              {events.map((e, i) => (
                <div
                  key={e.title}
                  className={`flex items-center gap-5 p-5 ${
                    i !== events.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="label-mono flex size-12 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                    {e.day}
                  </div>
                  <div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {e.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <FinalCta
        title="Find your people."
        subtitle="Join thousands of learners who are switching careers together — with help every step of the way."
      />
    </>
  )
}
