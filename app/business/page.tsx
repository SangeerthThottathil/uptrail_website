import type { Metadata } from 'next'
import {
  Building2,
  Rocket,
  Landmark,
  Users,
  BarChart3,
  Workflow,
  Megaphone,
  Brain,
  Crown,
  Monitor,
  MapPin,
  Blend,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { Container, SectionLabel, CtaButton } from '@/components/site-ui'
import { PixelFlame } from '@/components/pixel-flame'
import { BusinessForm } from '@/components/business-form'
import { getSettings } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'Corporate Data & AI Training for Teams | Uptrail',
  description:
    'Upskill your team with live, expert-led training in data, AI and digital skills. Hands-on workshops and programmes built around your tools and your own data.',
}

const audiences = [
  { icon: Rocket, title: 'Startups', desc: 'Move fast with teams that can analyse, build and ship.' },
  { icon: Building2, title: 'SMEs', desc: 'Close skills gaps without expensive new hires.' },
  { icon: Landmark, title: 'Corporates', desc: 'Scale capability across departments and regions.' },
  { icon: Users, title: 'Public Sector', desc: 'Modernise teams with practical, accountable training.' },
]

const areas = [
  { icon: BarChart3, title: 'Data Analytics', desc: 'SQL, Python, dashboards and decision-making with data.' },
  { icon: Workflow, title: 'Business Analysis', desc: 'Requirements, process mapping and agile delivery.' },
  { icon: Brain, title: 'AI & Automation', desc: 'Applied AI, prompt engineering and workflow automation.' },
  { icon: Megaphone, title: 'Digital Marketing', desc: 'SEO, paid acquisition, content and analytics.' },
  { icon: Crown, title: 'Leadership Skills', desc: 'Managing teams, stakeholders and change.' },
]

const delivery = [
  { icon: Monitor, title: 'Live Online', desc: 'Expert-led virtual sessions for distributed teams.' },
  { icon: MapPin, title: 'Onsite', desc: 'In-person training delivered at your offices.' },
  { icon: Blend, title: 'Hybrid', desc: 'Blend live and self-paced learning around your schedule.' },
]

const why = [
  'Live, expert-led training — never pre-recorded',
  'Practical learning tied to real workplace tasks',
  'Flexible delivery that fits around your operations',
  'Custom programmes designed around your goals',
]

const process = [
  { step: '01', title: 'Discovery Call', desc: 'We learn your goals, teams and skills gaps.' },
  { step: '02', title: 'Skills Assessment', desc: 'We benchmark current capability across your team.' },
  { step: '03', title: 'Programme Design', desc: 'We build a tailored curriculum and schedule.' },
  { step: '04', title: 'Delivery', desc: 'Live sessions, projects and mentor support.' },
  { step: '05', title: 'Impact Review', desc: 'We measure outcomes against your objectives.' },
]

export default async function BusinessPage() {
  const settings = await getSettings()
  const brochureEnabled = settings.general.downloadBrochureEnabled
  const brochureUrl = settings.general.downloadBrochureUrl

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-56 opacity-80">
          <PixelFlame rows={7} cols={64} className="h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
        </div>
        <Container className="relative pt-28 pb-16 sm:pt-32 sm:pb-20">
          <div className="max-w-3xl animate-fade-up">
            <SectionLabel>For Business</SectionLabel>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              Upskill your workforce with expert-led training
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Live programmes designed to help teams develop practical skills in
              data, AI, business and digital technologies — built around your
              goals and delivered by industry practitioners.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CtaButton href="#book-discovery" variant="primary">
                Book Discovery Call
                <ArrowRight className="size-4" />
              </CtaButton>
              {brochureEnabled && brochureUrl ? (
                <CtaButton
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                >
                  Download Brochure
                </CtaButton>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {/* Who we help */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-20">
          <SectionLabel>Who we help</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Training that scales with your organisation
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <div key={a.title} className="flex flex-col gap-3 bg-background p-6">
                <a.icon className="size-6 text-accent" />
                <h3 className="text-lg font-semibold tracking-tight">{a.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Training areas */}
      <section className="border-b border-border bg-secondary">
        <Container className="py-16 sm:py-20">
          <SectionLabel>Training areas</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Build the capabilities your teams need
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <div key={a.title} className="flex items-start gap-4 rounded-lg border border-border bg-background p-6">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent/10 text-accent">
                  <a.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold tracking-tight">{a.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Delivery options */}
      <section className="border-b border-border" id="workshops">
        <Container className="py-16 sm:py-20">
          <SectionLabel>Delivery options</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Corporate workshops, your way
          </h2>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
            Every workshop is custom-built for your team and can be delivered in
            whichever format works best for you.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {delivery.map((d) => (
              <div key={d.title} className="rounded-lg border border-border p-7">
                <d.icon className="size-7 text-accent" />
                <h3 className="mt-4 text-xl font-semibold tracking-tight">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why Uptrail */}
      <section className="border-b border-border bg-secondary">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <SectionLabel>Why Uptrail</SectionLabel>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Practical training that shows up in your results
              </h2>
              <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
                We are not a content library. Every programme is live, mentored
                and tied directly to the work your teams do every day.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2">
              {why.map((w) => (
                <li
                  key={w}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background p-5"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-accent" />
                  <span className="text-sm leading-relaxed text-foreground">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="border-b border-border">
        <Container className="py-16 sm:py-20">
          <SectionLabel>Our process</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            From first call to measurable impact
          </h2>
          <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-5">
            {process.map((p) => (
              <li key={p.step} className="flex flex-col gap-3 bg-background p-6">
                <span className="label-mono text-accent">{p.step}</span>
                <h3 className="font-semibold tracking-tight">{p.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Discovery call form */}
      <section id="book-discovery" className="scroll-mt-24 bg-secondary">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <SectionLabel>Book a discovery call</SectionLabel>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready to develop your team?
              </h2>
              <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
                Tell us about your team and goals. We will design a tailored
                training programme and follow up within one working day.
              </p>
            </div>
            <BusinessForm variant="training" />
          </div>
        </Container>
      </section>
    </>
  )
}
