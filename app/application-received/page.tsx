import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { Container } from '@/components/site-ui'

export const metadata: Metadata = {
  title: 'Application Received | Uptrail',
  description: 'Thank you for your submission.',
}

export default function ApplicationReceivedPage() {
  return (
    <main className="flex min-h-[75vh] items-center bg-[#f4f4f4] py-16 sm:py-24">
      <Container className="max-w-2xl text-center flex flex-col items-center gap-6">
        {/* Brand blue circular badge with checkmark */}
        <div className="flex size-20 items-center justify-center rounded-full bg-accent/10 border border-accent/20 text-accent shadow-sm animate-fade-in">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent/20">
            <Check className="size-7 stroke-[3]" />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-6xl mt-4">
          Application Received
        </h1>

        <p className="max-w-xl text-pretty leading-relaxed text-[#555555] sm:text-lg">
          Thank you for your submission. The programme is currently open for
          interest — the next start date hasn&apos;t been announced yet, but we
          will contact you as soon as it&apos;s confirmed.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent text-accent-foreground px-8 py-4 text-sm font-semibold tracking-wide transition-all hover:brightness-105 shadow-md shadow-accent/10 cursor-pointer"
          >
            RETURN HOME
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/programmes"
            className="inline-flex items-center justify-center rounded-full border border-[#e5e5e5] bg-white text-[#333333] px-8 py-4 text-sm font-semibold tracking-wide transition-colors hover:bg-gray-50 cursor-pointer"
          >
            EXPLORE PROGRAMMES
          </Link>
        </div>
      </Container>
    </main>
  )
}
