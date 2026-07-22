import { Container, CtaButton, SectionLabel } from '@/components/site-ui'
import { TestimonialCard } from '@/components/testimonial-card'
import type { Testimonial } from '@/lib/store/types'

export function TestimonialsSection({ testimonials = [] }: { testimonials: Testimonial[] }) {
  return (
    <section className="border-b border-border bg-secondary/40 py-20 sm:py-28">
      <Container>
        <div className="max-w-2xl">
          <SectionLabel>Learner stories</SectionLabel>
          <h2 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Careers changed, in their own words.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3 items-start">
          {testimonials.slice(0, 6).map((t, i) => (
            <TestimonialCard key={`${t.name || 'testimonial'}-${i}`} testimonial={t} />
          ))}
        </div>

        <div className="mt-10">
          <CtaButton href="/reviews" variant="outline">
            Read all reviews
          </CtaButton>
        </div>
      </Container>
    </section>
  )
}
