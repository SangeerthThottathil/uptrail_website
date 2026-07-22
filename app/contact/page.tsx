import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import { Container } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { ContactForm } from '@/components/contact-form'
import { getSettings } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'Contact Uptrail | Programmes, Training & Hiring',
  description:
    'Questions about programmes, corporate training or hiring our graduates? Contact the Uptrail team — we usually respond within one working day.',
}

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const { contact } = await getSettings()
  const details = [
    { icon: Mail, label: 'Email', value: contact.email },
    { icon: Phone, label: 'Phone', value: contact.phone },
    { icon: MapPin, label: 'Studio', value: contact.address },
  ]

  return (
    <>
      <PageHeader
        label="Contact"
        title="Talk to our career team."
        description="Book a free, no-pressure consultation. We'll help you figure out which programme fits your goals — or whether now is even the right time."
      />

      <section>
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Get in touch
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Prefer to reach us directly? Use any of the details below, or fill
              in the form and we&apos;ll come to you.
            </p>
            <div className="mt-8 space-y-px overflow-hidden rounded-lg border border-border">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center gap-4 border-b border-border bg-background p-5 last:border-b-0"
                >
                  <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-foreground">
                    <d.icon className="size-5" />
                  </div>
                  <div>
                    <div className="label-mono text-muted-foreground">
                      {d.label}
                    </div>
                    <div className="mt-0.5 font-medium">{d.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-7 sm:p-9">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  )
}
