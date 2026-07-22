import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { RotatingHeadline } from '@/components/home/rotating-headline'
import type { SuccessStory } from '@/lib/store/types'

export function Hero({
  featuredSuccessStory,
}: {
  featuredSuccessStory?: SuccessStory
}) {
  const storySlug = featuredSuccessStory
    ? featuredSuccessStory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    : ''

  return (
    <section className="grid border-b border-border lg:grid-cols-[1.7fr_1fr]">
      {/* LEFT COLUMN: headline over faded portrait + accent stat */}
      <div className="relative flex flex-col overflow-hidden">
        {/* Faded background portrait */}
        <Image
          src="/images/hero-portrait.png"
          alt="Smiling Uptrail learner"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 63vw"
          className="pointer-events-none object-cover object-center opacity-30 grayscale [mask-image:linear-gradient(to_bottom,transparent,black_30%)]"
        />

        <div className="relative z-10 flex flex-1 flex-col justify-between px-5 pb-8 pt-16 sm:px-8 lg:pt-28">
          <RotatingHeadline />

          <div className="mt-24 flex items-stretch gap-4 sm:mt-32 lg:mt-40">
            <span className="w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <div>
              <div className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                4,000+
              </div>
              <p className="mt-1 max-w-[12rem] text-sm leading-snug text-muted-foreground">
                learners upskilled and career-ready
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: intro (top) + featured news (bottom) */}
      <div className="flex flex-col justify-between gap-10 border-t border-border bg-secondary px-5 py-10 sm:px-8 lg:border-l lg:border-t-0 lg:py-16">
        <div className="flex flex-col gap-8">
          <p className="text-pretty text-2xl leading-snug tracking-tight text-foreground sm:text-3xl">
            We help graduates and career switchers break into data, business and
            digital roles.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/programmes"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3.5 text-sm font-medium text-accent-foreground transition-all hover:brightness-105"
            >
              View programmes
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-foreground/20 px-5 py-3.5 text-sm font-medium text-foreground transition-all hover:border-foreground/50"
            >
              Book a career consultation
            </Link>
          </div>
        </div>

        {featuredSuccessStory ? (
          <div className="flex flex-col gap-5">
            <hr className="border-t border-border" />

            <div>
              <p className="label-mono mb-3 text-[11px] text-muted-foreground">
                Featured story
              </p>
              <Link
                href={`/success-stories#${storySlug}`}
                className="group flex items-stretch gap-4 border border-border bg-background p-3 transition-colors hover:bg-secondary"
              >
                <div className="flex flex-1 items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {featuredSuccessStory.featuredTitle || `How ${featuredSuccessStory.name} went from ${featuredSuccessStory.fromRole} to ${featuredSuccessStory.toRole}.`}
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
