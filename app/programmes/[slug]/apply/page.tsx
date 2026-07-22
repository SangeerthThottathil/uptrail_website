import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { Container, SectionLabel } from '@/components/site-ui'
import { getProgramme } from '@/lib/store/store'
import { ApplicationFormClient } from './application-form-client'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const programme = await getProgramme(slug)
  if (!programme) return { title: 'Apply | Uptrail' }
  return {
    title: `Apply for ${programme.title} | Uptrail`,
    description: `Submit your application for the ${programme.title} course at Uptrail.`,
  }
}

export default async function ApplyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { slug } = await params
  const { plan } = await searchParams
  const programme = await getProgramme(slug)

  if (!programme) {
    notFound()
  }

  const selectedPlan = typeof plan === 'string' ? plan.trim() : 'General Application'

  const included = [
    'Live weekly sessions with expert instructors',
    'One-to-one mentorship and weekly feedback',
    'A reviewed capstone project for your portfolio',
    'Dedicated career coaching and interview prep',
    'A global peer community and alumni network',
  ]

  const basePath =
    programme.track === 'bootcamp'
      ? '/bootcamps'
      : programme.track === 'certification'
        ? '/certifications'
        : '/programmes'

  return (
    <main className="bg-secondary/10 py-12 sm:py-16">
      <Container className="max-w-6xl">
        <Link
          href={`${basePath}/${slug}`}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to programme details
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Left Column: Programme Information */}
          <div className="flex flex-col justify-start">
            <SectionLabel>{programme.category} Programme</SectionLabel>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Apply for {programme.title}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {programme.blurb}
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                What is included
              </h3>
              <ul className="mt-4 flex flex-col gap-3.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="rounded-2xl border border-border bg-background p-6 shadow-md sm:p-8">
            <div className="mb-6 border-b border-border pb-6">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Submit Your Application
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Please fill in your details to start the enrolment process.
              </p>
            </div>

            {/* Selected Plan Banner right at the top of the form */}
            <div className="mb-6 rounded-lg bg-accent/10 border border-accent/20 px-4 py-3 text-sm text-accent font-medium">
              You selected: <span className="font-semibold">{selectedPlan}</span>
            </div>

            <ApplicationFormClient programmeSlug={slug} selectedPlan={selectedPlan} />
          </div>
        </div>
      </Container>
    </main>
  )
}
