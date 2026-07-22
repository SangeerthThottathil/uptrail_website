import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Award, Users, ShieldCheck } from 'lucide-react'
import { Container, SectionLabel } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { ProgrammeCard } from '@/components/programme-card'
import { FinalCta } from '@/components/final-cta'
import { getProgrammes } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'Certifications — Uptrail',
  description:
    'Earn globally recognised, industry-standard certifications with live mentoring, hands-on projects and full exam preparation.',
}

const highlights = [
  {
    icon: Award,
    title: 'Globally recognised',
    detail:
      'Earn industry-standard credentials that employers know and trust across every sector.',
  },
  {
    icon: Users,
    title: 'Live mentoring',
    detail:
      'Weekly mentor-led sessions and hands-on projects keep you on track from day one.',
  },
  {
    icon: ShieldCheck,
    title: 'Exam-ready',
    detail:
      'Full exam preparation and practice so you walk into the exam with confidence.',
  },
]

export default async function CertificationsPage() {
  const programmes = await getProgrammes()
  const certifications = programmes.filter((p) => p.track === 'certification')

  return (
    <main>
      <PageHeader
        label="Certifications"
        title="Get certified, get ahead."
        description="Earn globally recognised certifications through mentor-led programmes that combine live teaching, hands-on projects and complete exam preparation."
      />

      <Container className="py-16 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-3">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <h.icon className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight">
                {h.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {h.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="flex items-end justify-between">
            <SectionLabel>Explore certifications</SectionLabel>
            <Link
              href="/programmes"
              className="hidden items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent sm:flex"
            >
              Want a full career programme?
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((programme) => (
              <ProgrammeCard key={programme.slug} programme={programme} />
            ))}
          </div>
        </div>
      </Container>

      <FinalCta
        title="Ready to get certified?"
        subtitle="Book a free 20-minute consultation and we'll help you choose the certification that best fits your goals."
      />
    </main>
  )
}
