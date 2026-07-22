'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import { submitHireTalent, submitDiscoveryCall } from '@/app/actions/submit'

type Variant = 'hire' | 'training'

const copy: Record<
  Variant,
  {
    needLabel: string
    needPlaceholder: string
    teamLabel: string
    teamOptions: string[]
    messageLabel: string
    messagePlaceholder: string
    submit: string
    successTitle: string
    successBody: string
  }
> = {
  hire: {
    needLabel: 'Roles you are hiring for',
    needPlaceholder: 'e.g. Data Analyst, Junior PM, Marketing Associate',
    teamLabel: 'How many hires?',
    teamOptions: ['1 role', '2–5 roles', '6–10 roles', '10+ roles'],
    messageLabel: 'Tell us about the team',
    messagePlaceholder:
      'Share the skills, seniority and context for the roles you want to fill…',
    submit: 'Request talent',
    successTitle: 'Thanks — your request is in.',
    successBody:
      'Our talent team will reach out within one working day with a shortlist tailored to your roles.',
  },
  training: {
    needLabel: 'Training area of interest',
    needPlaceholder: 'e.g. Data Analytics, AI & Automation, Leadership',
    teamLabel: 'Team size to train',
    teamOptions: ['1–10 people', '11–50 people', '51–200 people', '200+ people'],
    messageLabel: 'What are your goals?',
    messagePlaceholder:
      'Tell us about your team, current skills gaps and what success looks like…',
    submit: 'Book discovery call',
    successTitle: 'Thanks — we&apos;ll be in touch.',
    successBody:
      'A member of our team will reach out within one working day to scope your training programme.',
  },
}

const inputClasses =
  'mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent'

export function BusinessForm({ variant }: { variant: Variant }) {
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const c = copy[variant]

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrorMessage(null)
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') ?? '')
    const company = String(form.get('company') ?? '')
    const email = String(form.get('email') ?? '')
    const team = String(form.get('team') ?? '')
    const need = String(form.get('need') ?? '')
    const message = String(form.get('message') ?? '')

    startTransition(async () => {
      try {
        let res: { ok: boolean; error?: string }
        if (variant === 'hire') {
          res = await submitHireTalent({
            name,
            company,
            email,
            numberOfHires: team,
            rolesHiringFor: need,
            message,
          })
        } else {
          res = await submitDiscoveryCall({
            name,
            company,
            email,
            teamSize: team,
            trainingArea: need,
            message,
          })
        }

        if (!res.ok) {
          setErrorMessage(res.error || 'Failed to submit enquiry. Please try again.')
          return
        }
        setSubmitted(true)
      } catch (err: any) {
        setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-border bg-background p-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">
          {/* success titles are plain text except training apostrophe */}
          {variant === 'training' ? "Thanks — we'll be in touch." : c.successTitle}
        </h3>
        <p className="leading-relaxed text-muted-foreground">{c.successBody}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-lg border border-border bg-background p-6 sm:p-8"
    >
      {errorMessage && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3.5 text-sm font-medium text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bf-name" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="bf-name"
            name="name"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="bf-company" className="text-sm font-medium">
            Company
          </label>
          <input
            id="bf-company"
            name="company"
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="bf-email" className="text-sm font-medium">
            Work email
          </label>
          <input
            id="bf-email"
            name="email"
            type="email"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="bf-team" className="text-sm font-medium">
            {c.teamLabel}
          </label>
          <select id="bf-team" name="team" className={inputClasses}>
            {c.teamOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="bf-need" className="text-sm font-medium">
          {c.needLabel}
        </label>
        <input
          id="bf-need"
          name="need"
          placeholder={c.needPlaceholder}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="bf-message" className="text-sm font-medium">
          {c.messageLabel}
        </label>
        <textarea
          id="bf-message"
          name="message"
          rows={4}
          placeholder={c.messagePlaceholder}
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-all hover:brightness-105 disabled:opacity-60 sm:w-auto cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Submitting…</span>
          </>
        ) : (
          <>
            <span>{c.submit}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  )
}
