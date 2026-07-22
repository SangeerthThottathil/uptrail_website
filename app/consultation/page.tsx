import type { Metadata } from 'next'
import { CalendarClock, Compass, MessagesSquare, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { ConsultationForm } from '@/components/consultation-form'
import { ZohoBookingWidget } from '@/components/zoho-booking-widget'
import { getProgrammes, getStats, getSettings } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'Book a Career Consultation | Uptrail',
  description:
    'Book a free, no-pressure career consultation. A Uptrail adviser will help you choose the right programme for your goals.',
}

const steps = [
  {
    icon: MessagesSquare,
    title: 'A real conversation',
    desc: 'A 30-minute call with a career adviser — not a sales pitch. We listen first.',
  },
  {
    icon: Compass,
    title: 'Personalised guidance',
    desc: 'We map your background and goals to the right path — or tell you honestly if now is not the time.',
  },
  {
    icon: CalendarClock,
    title: 'A clear next step',
    desc: 'You leave with a concrete plan, whether or not you join an Uptrail programme.',
  },
]

export default async function ConsultationPage() {
  const [stats, programmes, settings] = await Promise.all([
    getStats(),
    getProgrammes(),
    getSettings(),
  ])

  const iframeEnabled = !!settings.general.consultationIframeEnabled
  const iframeRawUrl = settings.general.consultationIframeUrl || ''

  let iframeUrl = ''
  if (iframeEnabled && iframeRawUrl.trim()) {
    const trimmed = iframeRawUrl.trim()
    if (trimmed.startsWith('<iframe')) {
      const srcMatch = trimmed.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i)
      if (srcMatch && srcMatch[1]) {
        iframeUrl = srcMatch[1]
      }
    } else {
      iframeUrl = trimmed
    }
  }

  return (
    <>
      <PageHeader
        label="Book a Career Consultation"
        title="Get expert guidance on your next move."
        description="Book a free, no-pressure consultation. We'll help you figure out which programme fits your goals — or whether now is even the right time."
      />

      <section>
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              What to expect
            </h2>
            <div className="mt-8 space-y-px overflow-hidden rounded-lg border border-border">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="flex items-start gap-4 border-b border-border bg-background p-5 last:border-b-0"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground">
                    <step.icon className="size-5" />
                  </div>
                  <div>
                    <div className="font-medium">{step.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-5">
              <ShieldCheck className="size-5 shrink-0 text-accent" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                100% free and obligation-free. We will never pressure you to
                enrol.
              </p>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
              {stats.slice(0, 4).map((stat) => (
                <div key={stat.label} className="bg-background p-5">
                  <dt className="text-2xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-snug text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {iframeEnabled && settings.general.booking_widget_url ? (
            <ZohoBookingWidget bookingWidgetUrl={settings.general.booking_widget_url} />
          ) : iframeEnabled && iframeUrl ? (
            <div className="rounded-2xl border border-border bg-background p-4 shadow-md sm:p-6 h-[650px] flex flex-col">
              <h2 className="text-xl font-semibold tracking-tight px-2 pb-3 border-b border-border mb-4">
                Select Date &amp; Time
              </h2>
              <div className="flex-1 w-full relative">
                <iframe
                  src={iframeUrl}
                  className="absolute inset-0 h-full w-full border-0 bg-transparent rounded-lg"
                  allow="geolocation; microphone; camera; clipboard-write; autoplay"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-background p-7 sm:p-9 shadow-md">
              <h2 className="text-xl font-semibold tracking-tight">
                Request your consultation
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill in a few details and we&apos;ll be in touch within one working
                day.
              </p>
              <div className="mt-6">
                <ConsultationForm programmes={programmes} />
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
