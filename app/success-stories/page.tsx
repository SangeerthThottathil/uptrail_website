import type { Metadata } from 'next'
import { Container, SectionLabel } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { FinalCta } from '@/components/final-cta'
import { TestimonialCard, StarRating } from '@/components/testimonial-card'
import { Star } from 'lucide-react'
import { VideoTestimonials } from '@/components/home/video-testimonials'
import { getStats, getEmployers, getTestimonials, getVideoTestimonials, getSuccessStories } from '@/lib/store/store'
import { AlumniReviewsList } from '@/components/alumni-reviews-list'

export const metadata: Metadata = {
  title: 'Success Stories — Uptrail',
  description:
    'Reviews, testimonials, career outcomes and alumni stories from Uptrail graduates. Rated 4.9/5 across 1,500+ learners.',
}

export const revalidate = 0

const breakdown = [
  { stars: 5, pct: 92 },
  { stars: 4, pct: 6 },
  { stars: 3, pct: 1 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
]

const salarySteps = [
  { stage: 'Before Uptrail', value: '£22k', width: '38%' },
  { stage: 'First role after', value: '£36k', width: '64%' },
  { stage: 'Two years later', value: '£52k', width: '92%' },
]

export default async function SuccessStoriesPage() {
  const [stats, employers, testimonials, videoTestimonials, alumni] = await Promise.all([
    getStats(),
    getEmployers(),
    getTestimonials(),
    getVideoTestimonials(),
    getSuccessStories(),
  ])
  const allReviews = testimonials

  return (
    <main>
      <PageHeader
        label="Success Stories"
        title="Real people. Real career changes."
        description="Reviews, outcomes and alumni stories from the graduates who trusted us with their next step — rated 4.9 out of 5 across 1,500+ learners."
      />

      {/* Outcomes stats */}
      <Container className="py-16 sm:py-20">
        <SectionLabel>Career outcomes</SectionLabel>
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card p-8">
              <div className="text-4xl font-semibold tracking-tight">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel>Salary progression</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight">
              Earning more, faster.
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Median reported salary across Uptrail alumni who switched into a
              new career track.
            </p>
            <div className="mt-8 flex flex-col gap-6">
              {salarySteps.map((step) => (
                <div key={step.stage}>
                  <div className="flex items-baseline justify-between text-sm font-medium">
                    <span>{step.stage}</span>
                    <span>{step.value}</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: step.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-2xl border border-border bg-card p-8">
            <div className="flex items-center gap-4">
              <div className="text-5xl font-semibold tracking-tight">4.9</div>
              <div>
                <StarRating rating={5} />
                <div className="mt-1 text-xs text-muted-foreground">
                  Average rating across platforms
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              {breakdown.map((b) => (
                <div key={b.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-right font-medium">{b.stars}</span>
                  <Star className="size-3.5 fill-highlight text-highlight" />
                  <div className="h-2 flex-1 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-highlight"
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground font-medium">
                    {b.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20">
          <SectionLabel>Where our alumni work</SectionLabel>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-6">
            {employers.map((emp) => (
              <span key={emp.name} className="text-lg font-bold tracking-tight text-muted-foreground/60 select-none">
                {emp.name}
              </span>
            ))}
          </div>
        </div>
      </Container>

      {/* Alumni Stories list */}
      <section className="border-t border-border bg-secondary/30">
        <Container className="py-16 sm:py-24">
          <SectionLabel>Alumni stories</SectionLabel>
          <h2 className="mt-5 text-balance text-3xl font-medium tracking-tight sm:text-4xl">
            From every background imaginable.
          </h2>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Our learners come from retail, hospitality, customer service and
            unemployed backgrounds. Here is how they transitioned.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {alumni.map((a, i) => {
              return (
                <article
                  key={`${a.name || 'alumni'}-${i}`}
                  className="flex flex-col rounded-2xl border border-border bg-background p-7 scroll-mt-24 transition-all duration-300 target:ring-2 target:ring-accent"
                  id={`story-${a.id}`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="rounded-md bg-secondary px-2.5 py-1 text-muted-foreground">
                      {a.fromRole}
                    </span>
                    <span className="text-accent">→</span>
                    <span className="rounded-md bg-accent/10 px-2.5 py-1 font-medium text-accent">
                      {a.toRole}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{a.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {a.story}
                  </p>
                </article>
              )
            })}
          </div>
        </Container>
      </section>

      <VideoTestimonials videoTestimonials={videoTestimonials} />

      {/* Reviews */}
      <Container className="py-16 sm:py-20">
        <SectionLabel>Reviews</SectionLabel>
        <div className="mt-10">
          <AlumniReviewsList reviews={allReviews} />
        </div>
      </Container>

      <FinalCta />
    </main>
  )
}
