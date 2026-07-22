import { Container, CtaButton } from '@/components/site-ui'
import { PixelFlame } from '@/components/pixel-flame'

export function FinalCta({
  title = 'Start your career journey today.',
  subtitle = 'Book a free consultation with our career team, or jump straight in and apply to the next cohort.',
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <section className="relative overflow-hidden bg-accent text-accent-foreground">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-30">
        <PixelFlame rows={6} cols={64} className="h-full" />
      </div>
      <Container className="relative py-20 text-center sm:py-28">
        <h2 className="mx-auto max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          {title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-accent-foreground/85">
          {subtitle}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <CtaButton
            href="/programmes"
            variant="dark"
            className="w-full sm:w-auto"
          >
            View programmes
          </CtaButton>
          <CtaButton
            href="/consultation"
            variant="ghost"
            className="w-full border-transparent sm:w-auto"
          >
            Book career consultation
          </CtaButton>
        </div>
      </Container>
    </section>
  )
}
