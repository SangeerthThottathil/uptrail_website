'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { Programme } from '@/lib/store/types'
import { submitContact } from '@/app/actions/submit'

const inputClasses =
  'mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-accent'

const experienceLevels = [
  'Student / recent graduate',
  'Early career (0–3 years)',
  'Mid career (3–8 years)',
  'Senior / career switcher (8+ years)',
]

const timeSlots = ['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Weekends']

export function ConsultationForm({ programmes = [] }: { programmes: Programme[] }) {
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    startTransition(async () => {
      await submitContact({
        source: 'consultation',
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        message: String(form.get('goals') ?? ''),
        fields: {
          'Programme of interest': String(form.get('programme') ?? ''),
          'Where are you now': String(form.get('experience') ?? ''),
          'Preferred call time': String(form.get('availability') ?? ''),
        },
      })
      setSubmitted(true)
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-border bg-secondary/40 p-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">
          Your consultation is requested.
        </h3>
        <p className="text-muted-foreground">
          A career adviser will email you within one working day to confirm a
          time that works around your schedule. No pressure, no obligation.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="programme" className="text-sm font-medium">
            Programme of interest
          </label>
          <select id="programme" name="programme" className={inputClasses}>
            <option value="">Not sure yet</option>
            {programmes.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="experience" className="text-sm font-medium">
            Where are you now?
          </label>
          <select id="experience" name="experience" className={inputClasses}>
            <option value="">Select one</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="availability" className="text-sm font-medium">
          When suits you best for a call?
        </label>
        <select id="availability" name="availability" className={inputClasses}>
          <option value="">Select a preferred time</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="goals" className="text-sm font-medium">
          What would you like to get out of the call?
        </label>
        <textarea
          id="goals"
          name="goals"
          rows={4}
          placeholder="Tell us about your goals, the roles you're aiming for, or any questions you have…"
          className={inputClasses}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-all hover:brightness-105 sm:w-auto disabled:opacity-50 disabled:pointer-events-none"
      >
        {isPending ? 'Booking...' : 'Book my free consultation'}
      </button>
    </form>
  )
}
