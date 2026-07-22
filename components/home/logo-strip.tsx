import { Container } from '@/components/site-ui'
import type { Employer } from '@/lib/store/types'

const ICON_BASE = 'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons'

export function LogoStrip({ employers = [] }: { employers: Employer[] }) {
  const row = [...employers, ...employers]
  return (
    <section className="border-b border-border bg-secondary/40 py-10">
      <Container>
        <p className="label-mono text-center text-muted-foreground">
          Our alumni now work at
        </p>
      </Container>
      <div className="relative mt-8 overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-16 pl-16">
          {row.map((employer, i) => (
            <img
              key={`${employer.slug}-${i}`}
              src={`${ICON_BASE}/${employer.slug}/default.svg`}
              alt={employer.name}
              className="h-7 w-auto opacity-90 transition-all duration-300 hover:opacity-100 sm:h-8"
              loading="lazy"
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  )
}
