import type { Metadata } from 'next'
import { CheckCircle2, Briefcase, Clock, ShieldCheck } from 'lucide-react'
import { Container, SectionLabel, CtaButton } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { BusinessForm } from '@/components/business-form'
import { getEmployers, getStats } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'Hire Talent | Uptrail',
  description:
    'Hire job-ready data, product and digital talent trained on real projects. Tell us your roles and we will match vetted candidates.',
}

const steps = [
  {
    n: '01',
    title: 'Tell us your roles',
    body: 'Share the skills, seniority and team context. We translate that into a candidate brief in a day.',
  },
  {
    n: '02',
    title: 'Meet a shortlist',
    body: 'We send a curated shortlist of vetted graduates with portfolios and mentor references attached.',
  },
  {
    n: '03',
    title: 'Hire with confidence',
    body: 'Interview, trial and hire. We support onboarding for the first 90 days at no extra cost.',
  },
]

const reasons = [
  {
    icon: Briefcase,
    title: 'Trained on real projects',
    body: 'Every graduate ships a portfolio of work modelled on the problems your team faces.',
  },
  {
    icon: Clock,
    title: 'Ready from day one',
    body: 'No lengthy ramp-up. Our learners know the modern tools your stack runs on.',
  },
  {
    icon: ShieldCheck,
    title: 'Vetted and referenced',
    body: 'We only put forward candidates whose work has been reviewed by working mentors.',
  },
  {
    icon: CheckCircle2,
    title: 'No upfront fees',
    body: 'You only pay when you make a successful hire. Browsing the talent pool is free.',
  },
]

export default async function HirePage() {
  const [employers, stats] = await Promise.all([
    getEmployers(),
    getStats(),
  ])
  return (
    <>
      <PageHeader
        label="For employers"
        title="Hire talent that is ready to contribute."
        description="We train data, product and digital professionals on the exact tools and workflows your teams use. Tell us what you need and meet a shortlist of vetted candidates within days."
      />

      <section className="border-b border-border">
        <Container className="flex flex-col items-start gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="label-mono text-muted-foreground">
            Graduates hired by teams at
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5">
            {employers.map((employer) => (
              <img
                key={employer.slug}
                src={`https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/${employer.slug}/default.svg`}
                alt={employer.name}
                className="h-7 w-auto opacity-90 transition-all duration-300 hover:opacity-100"
                loading="lazy"
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Why hire */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-24">
          <SectionLabel>Why Uptrail talent</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Skip the long ramp-up.
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {reasons.map((r) => (
              <div key={r.title} className="bg-background p-7">
                <r.icon className="size-6 text-accent" />
                <h3 className="mt-4 text-lg font-semibold tracking-tight">
                  {r.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="border-b border-border bg-secondary/40">
        <Container className="py-16 sm:py-24">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            From brief to hire in three steps.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.n}
                className="rounded-lg border border-border bg-background p-7"
              >
                <div className="label-mono text-accent">{s.n}</div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats + form */}
      <section>
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <SectionLabel>Request talent</SectionLabel>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Start hiring from our talent pool.
              </h2>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
                Tell us about the roles you are filling and we will introduce you
                to candidates who fit, fast.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
                {stats.map((s) => (
                  <div key={s.label} className="bg-background p-6">
                    <div className="text-3xl font-semibold tracking-tight">
                      {s.value}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <CtaButton href="/success-stories" variant="ghost">
                  See outcomes
                </CtaButton>
              </div>
            </div>

            <div id="request-talent" className="scroll-mt-24">
              <BusinessForm variant="hire" />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
