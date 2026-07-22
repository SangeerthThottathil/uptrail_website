import { ArrowUpRight } from 'lucide-react'
import { Container, CtaButton, SectionLabel } from '@/components/site-ui'
import { ProgrammeCard } from '@/components/programme-card'
import type { Programme } from '@/lib/store/types'

export function ProgrammesSection({ programmes = [] }: { programmes: Programme[] }) {
  return (
    <section className="border-b border-border py-20 sm:py-28" id="programmes">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <SectionLabel>Programmes</SectionLabel>
            <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Career tracks built for real outcomes.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Every programme is live, part-time and mentor-led — designed to
              fit around your life and end with a portfolio that gets you hired.
            </p>
          </div>
          <CtaButton href="/programmes" variant="outline">
            All programmes
            <ArrowUpRight className="size-4" />
          </CtaButton>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programmes.slice(0, 6).map((programme) => (
            <ProgrammeCard key={programme.slug} programme={programme} />
          ))}
        </div>
      </Container>
    </section>
  )
}
