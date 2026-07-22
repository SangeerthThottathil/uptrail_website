import {
  Users,
  Briefcase,
  Award,
  LifeBuoy,
  Check,
  X,
  Wallet,
  CalendarClock,
  TrendingUp,
  Clock,
  GraduationCap,
  Globe,
  ArrowUpRight,
  ClipboardCheck,
  Rocket,
  Target,
  Zap,
  ShieldCheck,
} from 'lucide-react'
import { Container, SectionLabel, CtaButton } from '@/components/site-ui'
import type { Programme } from '@/lib/data'
import { cn } from '@/lib/utils'

type Kind = 'programme' | 'bootcamp' | 'certification'

const reasons = [
  {
    icon: Users,
    title: 'Live, mentor-led teaching',
    detail:
      'Small cohorts taught live by practitioners who review your work every week — never pre-recorded and forgotten.',
  },
  {
    icon: Briefcase,
    title: 'A portfolio that gets interviews',
    detail:
      'You finish with real projects and a capstone that hiring managers actually want to talk about.',
  },
  {
    icon: LifeBuoy,
    title: 'Career coaching until you land',
    detail:
      'CV reviews, mock interviews and salary negotiation support that continues after you graduate.',
  },
  {
    icon: Award,
    title: 'Proven outcomes',
    detail:
      'Our alumni work at Amazon, HSBC, Tesco and more, with outcomes data we publish openly.',
  },
]

export function WhyChoose({
  programme,
  kind = 'programme',
}: {
  programme: Programme
  kind?: Kind
}) {
  return (
    <section className="border-t border-border bg-secondary/30">
      <Container className="py-16 sm:py-24">
        <SectionLabel>Why choose this {kind}</SectionLabel>
        <h2 className="mt-5 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl">
          Built to get you hired, not just certified.
        </h2>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          The {programme.title} {kind} pairs practical, employer-aligned skills
          with relentless career support — {programme.outcomes.toLowerCase()}.
        </p>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col gap-3 bg-card p-7"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <reason.icon className="size-5" />
              </span>
              <h3 className="text-lg font-semibold tracking-tight">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {reason.detail}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

export function ProgrammeOverview({
  programme,
  kind = 'programme',
}: {
  programme: Programme
  kind?: Kind
}) {
  const facts = [
    { icon: Clock, label: 'Duration', value: programme.duration },
    { icon: GraduationCap, label: 'Format', value: programme.format },
    { icon: Globe, label: 'Level', value: programme.level },
    { icon: TrendingUp, label: 'Outcome', value: programme.outcomes },
  ]

  return (
    <section className="border-t border-border">
      <Container className="py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionLabel>{kind} overview</SectionLabel>
            <h2 className="mt-5 text-balance text-3xl font-medium tracking-tight sm:text-4xl">
              What this {kind} is about
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-pretty leading-relaxed text-muted-foreground">
              <p>{programme.blurb}</p>
              <p>
                Over {programme.duration} of {programme.format.toLowerCase()}{' '}
                learning, you&apos;ll move from the fundamentals to job-ready
                skills through hands-on projects. It&apos;s {programme.level.toLowerCase()},
                so you can start with confidence and finish with proof of what
                you can do.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Highlight icon={CalendarClock} label="Duration" value={programme.duration} />
              <Highlight icon={Users} label="Format" value={programme.format} />
              <Highlight icon={TrendingUp} label="Outcome" value={programme.outcomes} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <dl className="flex flex-col gap-5">
              {facts.map((fact) => (
                <div key={fact.label} className="flex items-start gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <fact.icon className="size-4" />
                  </span>
                  <div>
                    <dt className="label-mono text-muted-foreground">
                      {fact.label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium">{fact.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            {programme.price ? (
              <div className="mt-6 rounded-xl bg-secondary/60 p-4">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold tracking-tight">
                    {programme.price.amount}
                  </p>
                  {programme.price.original ? (
                    <span className="text-sm text-muted-foreground line-through">
                      {programme.price.original}
                    </span>
                  ) : null}
                </div>
                {programme.price.save ? (
                  <p className="mt-1 label-mono text-accent">
                    {programme.price.save}
                  </p>
                ) : null}
                {programme.price.plan ? (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {programme.price.plan}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="mt-6 rounded-xl bg-secondary/60 p-4">
                <p className="text-2xl font-semibold tracking-tight">
                  {programme.salary}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Based on Uptrail alumni outcomes data.
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2.5">
              <CtaButton href="#payment" variant="primary">
                Apply for this {kind}
              </CtaButton>
              {programme.brochureEnabled && programme.brochureUrl ? (
                <CtaButton
                  href={programme.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                >
                  Download Brochure
                </CtaButton>
              ) : null}
              <CtaButton href="/consultation" variant="outline">
                Book a consultation
              </CtaButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Highlight({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-secondary/50 px-3.5 py-2.5">
      <Icon className="size-4 text-accent" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

const iconMap: Record<string, any> = {
  Wallet,
  CalendarClock,
  TrendingUp,
  Award,
  Zap,
  ShieldCheck,
}

import type { PaymentOption } from '@/lib/data'

const LEGACY_ICON_MAP: Record<string, string> = {
  Wallet: 'account_balance_wallet',
  CalendarClock: 'calendar_month',
  TrendingUp: 'trending_up',
  Award: 'workspace_premium',
  Zap: 'bolt',
  ShieldCheck: 'verified_user',
  CreditCard: 'credit_card',
}

const defaultPaymentOptions: PaymentOption[] = [
  {
    icon: 'account_balance_wallet',
    title: 'Pay in full',
    pillText: 'Save 10%',
    description: 'Pay upfront before your cohort starts and receive a 10% discount on the full price.',
    bulletPoints: ['Best value overall', 'One simple payment', 'Instant enrolment'],
    buttonLabel: 'Apply for this programme',
  },
  {
    icon: 'calendar_month',
    title: 'Interest-free plan',
    pillText: '0% interest',
    description: 'Spread the cost across monthly instalments with absolutely no interest or hidden fees.',
    bulletPoints: ['Flexible monthly payments', 'No credit checks', 'Cancel anytime before you start'],
    buttonLabel: 'Apply for this programme',
  },
  {
    icon: 'trending_up',
    title: 'Income Sharing Agreement',
    pillText: 'Pay when you earn',
    description: 'Pay nothing upfront. You only start paying once you land a role earning over £25,000.',
    bulletPoints: ['£0 to begin', 'Pay only when employed', 'Capped total repayment'],
    buttonLabel: 'Apply for this programme',
  },
]

export function PaymentOptions({
  kind = 'programme',
  options = [],
  programmeSlug = '',
}: {
  kind?: Kind
  options?: PaymentOption[]
  programmeSlug?: string
}) {
  const displayOptions = options && options.length > 0 ? options : defaultPaymentOptions
  
  const gridCols =
    displayOptions.length === 1
      ? 'md:grid-cols-1 max-w-md mx-auto'
      : displayOptions.length === 2
        ? 'md:grid-cols-2 max-w-3xl mx-auto'
        : 'md:grid-cols-3'

  return (
    <section id="payment" className="border-t border-border bg-secondary/30">
      <Container className="py-16 sm:py-24">
        <SectionLabel>Flexible payment options</SectionLabel>
        <h2 className="mt-5 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl">
          Choose how you pay.
        </h2>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Cost should never be the reason you don&apos;t start. Pick the option
          that fits your situation — including paying nothing until you&apos;re
          earning.
        </p>

        <div className={`mt-10 grid gap-6 ${gridCols}`}>
          {displayOptions.map((option, i) => {
            const rawIcon = option.icon || ''
            const iconName = LEGACY_ICON_MAP[rawIcon] || rawIcon || 'payments'
            const isHighlighted = !!option.isHighlighted
            return (
              <div
                key={option.title + '-' + i}
                className={`flex flex-col justify-between gap-6 rounded-2xl border bg-card p-7 ${
                  isHighlighted ? 'border-accent ring-1 ring-accent' : 'border-border'
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className={`flex size-10 items-center justify-center rounded-lg ${
                      isHighlighted ? 'bg-accent text-white' : 'bg-accent/10 text-accent'
                    }`}>
                      <span className="material-symbols-outlined text-[22px] leading-none select-none">
                        {iconName}
                      </span>
                    </span>
                    {option.pillText ? (
                      <span className="label-mono rounded-full bg-accent/10 px-3 py-1 text-[11px] text-accent">
                        {option.pillText}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight">
                    {option.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                  <ul className="mt-1 flex flex-col gap-2.5">
                    {(option.bulletPoints || []).map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {option.buttonLabel ? (
                  <div className="mt-2">
                    <CtaButton
                      href={programmeSlug ? `/programmes/${programmeSlug}/apply?plan=${encodeURIComponent(option.title || '')}` : '/contact'}
                      variant={isHighlighted ? 'primary' : 'outline'}
                      className="w-full text-center"
                    >
                      {option.buttonLabel}
                    </CtaButton>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Final pricing and eligibility for each {kind} are confirmed during
          your career consultation.
        </p>
      </Container>
    </section>
  )
}

export function CareerOutlook({ programme }: { programme: Programme }) {
  if (!programme.aboutRole && !programme.salaryLadder) return null

  return (
    <section className="border-t border-border">
      <Container className="py-16 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionLabel>About the role</SectionLabel>
            <h2 className="mt-5 text-balance text-3xl font-medium tracking-tight sm:text-4xl">
              A career with room to grow.
            </h2>
            {programme.aboutRole ? (
              <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">
                {programme.aboutRole}
              </p>
            ) : null}
          </div>

          {programme.salaryLadder ? (
            <div className="rounded-2xl border border-border bg-card p-7">
              <h3 className="label-mono text-muted-foreground">
                Typical salary progression
              </h3>
              <ol className="mt-6 flex flex-col">
                {programme.salaryLadder.map((step, i) => (
                  <li
                    key={step.role}
                    className="flex items-center justify-between gap-4 border-t border-border py-4 first:border-t-0 first:pt-0"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <TrendingUp className="size-4" />
                      </span>
                      <span className="text-sm font-medium">{step.role}</span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums">
                      {step.range}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-xs text-muted-foreground">
                Indicative UK salary ranges. Actual pay varies by employer,
                location and experience.
              </p>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  )
}

export function Certifications({ programme }: { programme: Programme }) {
  if (!programme.certifications?.length) return null

  return (
    <section className="border-t border-border bg-secondary/30">
      <Container className="py-16 sm:py-24">
        <SectionLabel>Certifications you&apos;ll earn</SectionLabel>
        <h2 className="mt-5 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl">
          Walk away officially certified.
        </h2>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Earn industry-recognised credentials that prove your skills to
          employers and set you apart in the job market.
        </p>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {programme.certifications.map((cert) => (
            <div
              key={cert.name}
              className={cn(
                "flex flex-col gap-3 bg-card p-7 transition-colors",
                cert.logoUrl ? "items-center text-center" : ""
              )}
            >
              {cert.logoUrl ? (
                <div className="flex items-center justify-center h-12 w-full mb-1">
                  <img
                    src={cert.logoUrl}
                    alt={`${cert.name} logo`}
                    className="h-12 w-auto object-contain"
                  />
                </div>
              ) : (
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Award className="size-5" />
                </span>
              )}
              <h3 className="text-lg font-semibold tracking-tight">
                {cert.name}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {cert.detail}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

const audience = [
  {
    title: 'Recent graduates',
    detail:
      'Kickstart your career with practical, job-ready skills and a portfolio that gets you noticed.',
  },
  {
    title: 'Career switchers',
    detail:
      'Transition into a new industry with structured training, hands-on projects and dedicated support.',
  },
  {
    title: 'Working professionals',
    detail:
      'Upskill with modern tools and methods to advance your career or pivot into a new role.',
  },
]

export function WhoIsItFor({ kind = 'programme' }: { kind?: Kind }) {
  return (
    <section className="border-t border-border">
      <Container className="py-16 sm:py-24">
        <SectionLabel>Who is this {kind} for?</SectionLabel>
        <h2 className="mt-5 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl">
          Built for people ready to move.
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {audience.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-7"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Users className="size-5" />
              </span>
              <h3 className="text-lg font-semibold tracking-tight">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

const steps = [
  {
    icon: ClipboardCheck,
    title: 'Enrol & onboard',
    detail:
      'Get instant access to the learning portal, set up your tools and meet your cohort in our community.',
  },
  {
    icon: GraduationCap,
    title: 'Master key skills',
    detail:
      'Move from fundamentals to advanced through live workshops, labs and quizzes led by expert mentors.',
  },
  {
    icon: Target,
    title: 'Apply your skills',
    detail:
      'Put theory into practice with real-world projects, each reviewed by a mentor to build a strong portfolio.',
  },
  {
    icon: Rocket,
    title: 'Get hired with support',
    detail:
      'Receive CV reviews, LinkedIn optimisation and interview coaching to help you land your next role.',
  },
]

export function HowItWorks({ kind = 'programme' }: { kind?: Kind }) {
  return (
    <section className="border-t border-border bg-secondary/30">
      <Container className="py-16 sm:py-24">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="mt-5 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl">
          A clear path from first lesson to first role.
        </h2>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          We make your journey structured and supported every step of the way,
          from onboarding through to landing the job.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <step.icon className="size-5" />
                </span>
                <span className="label-mono text-muted-foreground">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          The exact journey is tailored to each {kind} and your starting point.
        </p>
      </Container>
    </section>
  )
}

const comparison = [
  {
    traditional: 'Self-paced, pre-recorded content',
    uptrail: 'Live mentor-led sessions with recorded access',
  },
  {
    traditional: 'Limited tutor support',
    uptrail: '1:1 career coaching, live Q&A and mentor feedback',
  },
  {
    traditional: 'Minimal or theory-based projects',
    uptrail: 'Hands-on, portfolio-ready projects with feedback',
  },
  {
    traditional: 'No career coaching',
    uptrail: 'Personalised, ongoing career coaching',
  },
  {
    traditional: 'No long-term community access',
    uptrail: 'Lifetime community with peers, mentors and alumni',
  },
  {
    traditional: 'No networking or alumni support',
    uptrail: 'Access to alumni network, industry events and webinars',
  },
]

export function ProviderComparison() {
  return (
    <section className="border-t border-border">
      <Container className="py-16 sm:py-24">
        <SectionLabel>How we&apos;re different</SectionLabel>
        <h2 className="mt-5 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl">
          Not your average online course.
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          <div className="bg-card p-7">
            <h3 className="text-base font-semibold text-muted-foreground">
              Traditional providers
            </h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {comparison.map((row) => (
                <li
                  key={row.traditional}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                  <span className="leading-snug">{row.traditional}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card p-7 ring-1 ring-inset ring-accent">
            <h3 className="text-base font-semibold text-accent">Uptrail</h3>
            <ul className="mt-5 flex flex-col gap-3.5">
              {comparison.map((row) => (
                <li
                  key={row.uptrail}
                  className="flex items-start gap-3 text-sm"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="leading-snug">{row.uptrail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}

export function ProgrammeFaq({ programme }: { programme: Programme }) {
  if (!programme.faqs?.length) return null

  return (
    <section className="border-t border-border bg-secondary/30">
      <Container className="py-16 sm:py-24">
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="mt-5 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl">
          Frequently asked questions.
        </h2>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border">
          {programme.faqs.map((faq) => (
            <details key={faq.q} className="group bg-card">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-left text-base font-medium [&::-webkit-details-marker]:hidden">
                {faq.q}
                <ArrowUpRight className="size-4 shrink-0 text-accent transition-transform group-open:rotate-45" />
              </summary>
              <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
