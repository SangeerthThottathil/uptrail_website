import { Target, Clock, ShieldCheck } from 'lucide-react'
import { Container, CtaButton, SectionLabel } from '@/components/site-ui'

const benefits = [
  {
    icon: Target,
    title: 'Job-ready from day one',
    detail:
      'Candidates ship real projects during the programme, so they arrive with proof of skill — not just a certificate.',
  },
  {
    icon: Clock,
    title: 'Hire in days, not months',
    detail:
      'Tell us the role and we shortlist vetted, mentor-assessed talent matched to your stack and culture.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero upfront cost',
    detail:
      'No placement fees to browse our talent pool. You only invest once you find the right person.',
  },
]

export function EmployerSection() {
  return (
    <section className="border-b border-border bg-foreground py-20 text-background sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <SectionLabel className="text-background/60">
            For employers
          </SectionLabel>
          <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Hire mentor-vetted, job-ready talent.
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-background/70">
            Forward-thinking teams partner with Uptrail to build diverse,
            high-performing data, business and digital functions.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-background/15 bg-background/[0.04] p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <b.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-background/70">
                {b.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <CtaButton href="/hire" variant="primary">
            Partner with Uptrail
          </CtaButton>
        </div>
      </Container>
    </section>
  )
}
