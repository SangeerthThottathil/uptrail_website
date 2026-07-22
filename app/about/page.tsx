import type { Metadata } from 'next'
import { Compass, HeartHandshake, Sparkles } from 'lucide-react'
import { Container, SectionLabel } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { FinalCta } from '@/components/final-cta'
import { getStats } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'About Uptrail | Live Mentor-Led Career Programmes',
  description:
    'Uptrail helps graduates and career switchers break into data, business and digital roles through live, mentor-led programmes. UK-registered, globally taught.',
}

const values = [
  {
    icon: Compass,
    title: 'Outcomes over hours',
    body: 'We measure ourselves on whether our learners get hired, not on how many videos they watch.',
  },
  {
    icon: HeartHandshake,
    title: 'Human by default',
    body: 'Real mentors, real cohorts, real feedback. We believe people learn best with other people.',
  },
  {
    icon: Sparkles,
    title: 'Access for all',
    body: 'Flexible payment plans and part-time formats mean a new career does not require pausing your life.',
  },
]

const team = [
  { name: 'Elena Marsh', role: 'Founder & CEO', initials: 'EM' },
  { name: 'Kwame Boateng', role: 'Head of Learning', initials: 'KB' },
  { name: 'Sofia Castellano', role: 'Director of Careers', initials: 'SC' },
  { name: 'Raj Patel', role: 'Head of Partnerships', initials: 'RP' },
]

export default async function AboutPage() {
  const stats = await getStats()
  return (
    <>
      <PageHeader
        label="About Uptrail"
        title="Careers change lives. We make that change possible."
        description="Uptrail started with a simple frustration: traditional education is slow, expensive and rarely connected to real jobs. We built the school we wished existed — practical, mentor-led and built around getting hired."
      />

      {/* Mission */}
      <section className="border-b border-border">
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionLabel>Our mission</SectionLabel>
            <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              To help one million people build careers they are proud of.
            </h2>
          </div>
          <div className="space-y-4 text-pretty leading-relaxed text-muted-foreground">
            <p>
              We focus on the disciplines with the most demand and the clearest
              paths in — data, product and digital — and we teach them the way
              the work actually happens.
            </p>
            <p>
              Every programme is taught live by practitioners, anchored by a
              portfolio project, and backed by a careers team whose only job is
              to get you interviews and offers. No pre-recorded filler, no
              passive watching.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats */}
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

      {/* Values */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-24">
          <SectionLabel>What we believe</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Three principles guide everything we build.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="bg-background p-7">
                <div className="flex size-11 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <v.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-24">
          <SectionLabel>The team</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Builders, educators and career coaches.
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div
                key={m.name}
                className="rounded-lg border border-border bg-background p-6"
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-lg font-semibold tracking-tight">
                  {m.initials}
                </div>
                <div className="mt-4 font-semibold tracking-tight">
                  {m.name}
                </div>
                <div className="text-sm text-muted-foreground">{m.role}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <FinalCta
        title="Build a career you are proud of."
        subtitle="Explore our programmes or talk to our team about where you want to go next."
      />
    </>
  )
}
