import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Check } from 'lucide-react'
import { Container, SectionLabel } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { FinalCta } from '@/components/final-cta'
import {
  WhyChoose,
  ProgrammeOverview,
  PaymentOptions,
  CareerOutlook,
  Certifications,
  WhoIsItFor,
  HowItWorks,
  ProviderComparison,
  ProgrammeFaq,
} from '@/components/programme-detail-sections'
import { ProgrammeProof } from '@/components/programme-proof'
import { getProgramme, getProgrammes, getTestimonials, getProgrammeVideoTestimonials } from '@/lib/store/store'

export async function generateStaticParams() {
  const programmes = await getProgrammes()
  return programmes
    .filter((p) => p.track === 'bootcamp')
    .map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const programme = await getProgramme(slug)
  if (!programme || programme.track !== 'bootcamp') return { title: 'Bootcamp — Uptrail' }
  return {
    title: programme.seoTitle || `${programme.title} — Uptrail`,
    description: programme.metaDescription || programme.blurb,
  }
}

export default async function BootcampDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [programme, testimonials, videoTestimonials] = await Promise.all([
    getProgramme(slug),
    getTestimonials(),
    getProgrammeVideoTestimonials(slug),
  ])
  if (!programme || programme.track !== 'bootcamp') notFound()

  const included = [
    'Live weekly sessions with expert instructors',
    'One-to-one mentorship and weekly feedback',
    'A reviewed capstone project for your portfolio',
    'Dedicated career coaching and interview prep',
    'A global peer community and alumni network',
    'A verified certificate of completion',
  ]

  return (
    <main>
      <PageHeader
        label={`${programme.category} bootcamp`}
        title={programme.title}
        description={programme.blurb}
        image={programme.image}
        imageAlt={`Learners on the ${programme.title} bootcamp`}
      />

      <ProgrammeOverview programme={programme} kind="bootcamp" />
      <CareerOutlook programme={programme} />
      <WhyChoose programme={programme} kind="bootcamp" />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <SectionLabel>Curriculum</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight">
              What you will learn
            </h2>
            <ol className="mt-8 flex flex-col">
              {programme.modules.map((module, i) => (
                <li
                  key={module.title}
                  className="flex gap-5 border-t border-border py-6 first:border-t-0 first:pt-0"
                >
                  <span className="label-mono mt-1 text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{module.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {module.detail}
                    </p>
                    {module.takeaways ? (
                      <ul className="mt-3 flex flex-col gap-2">
                        {module.takeaways.map((takeaway) => (
                          <li
                            key={takeaway}
                            className="flex items-start gap-2.5 text-sm text-muted-foreground"
                          >
                            <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
                            <span className="leading-snug">{takeaway}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12">
              <SectionLabel>Skills you will gain</SectionLabel>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {programme.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-sm"
                  >
                    <Check className="size-3.5 text-accent" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-7">
              <h3 className="text-lg font-semibold tracking-tight">
                What&apos;s included
              </h3>
              <ul className="mt-5 flex flex-col gap-3.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>

      <Certifications programme={programme} />
      <WhoIsItFor kind="bootcamp" />
      <HowItWorks kind="bootcamp" />
      <ProviderComparison />

      <ProgrammeProof
        programme={programme}
        testimonials={testimonials}
        videoTestimonials={videoTestimonials}
      />
      <ProgrammeFaq programme={programme} />
      <PaymentOptions kind="bootcamp" options={programme.paymentOptions} programmeSlug={programme.slug} />

      <FinalCta />
    </main>
  )
}
