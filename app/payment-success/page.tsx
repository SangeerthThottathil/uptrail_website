import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Mail, Calendar, GraduationCap, ArrowRight, HelpCircle, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/site-ui'

export const metadata: Metadata = {
  title: 'Payment Successful | Enrolment Confirmed | Uptrail',
  description: 'Thank you for your payment. Your enrolment with Uptrail is confirmed.',
  robots: { index: false, follow: false },
}

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-[80vh] bg-secondary/10 py-16 sm:py-24 flex items-center">
      <Container className="max-w-3xl">
        <div className="flex flex-col items-center text-center">
          {/* Animated Success Badge */}
          <div className="relative mb-6 flex size-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="size-10 stroke-[2.2]" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 mb-3">
            <ShieldCheck className="size-3.5" /> Payment Successful
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Welcome to Uptrail!
          </h1>

          <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Thank you for completing your payment. Your enrolment is now confirmed, and your place in the programme has been secured.
          </p>

          {/* Next Steps Card */}
          <div className="mt-10 w-full text-left rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
            <h2 className="text-xs font-bold tracking-wider text-accent uppercase">
              What happens next?
            </h2>

            <div className="mt-6 flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent font-medium">
                  <Mail className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">1. Check your email for your receipt</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Stripe has automatically emailed a detailed payment receipt to the email address provided during checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-border/60 pt-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent font-medium">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">2. Onboarding &amp; schedule details</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Our admissions team will send your portal login details, live session calendar, and cohort orientation instructions within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 border-t border-border/60 pt-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent font-medium">
                  <GraduationCap className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">3. Prepare for orientation</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Get ready to meet your mentor and peer community. Make sure your Slack and Zoom accounts are ready for live sessions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Note */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <HelpCircle className="size-4 text-accent shrink-0" />
            <span>
              Have questions about your enrolment?{' '}
              <Link href="/contact" className="font-medium text-foreground underline hover:text-accent transition-colors">
                Contact our support team
              </Link>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-medium text-accent-foreground transition-all hover:brightness-105 shadow-sm"
            >
              Return Home
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/programmes"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              Explore Programmes
            </Link>
          </div>
        </div>
      </Container>
    </main>
  )
}
