'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { submitContact } from '@/app/actions/submit'
import { cn } from '@/lib/utils'

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const wordCount = message.trim() ? message.trim().split(/\s+/).length : 0

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (wordCount > 200) return
    setErrorMessage(null)

    const form = new FormData(e.currentTarget)
    const enquiryType = String(form.get('enquiryType') ?? 'individual')
    const phoneExtension = String(form.get('phoneExtension') ?? '+91')
    const phoneNumberOnly = String(form.get('phoneNumberOnly') ?? '').trim()
    const fullPhone = `${phoneExtension} ${phoneNumberOnly}`

    startTransition(async () => {
      try {
        const res = await submitContact({
          source: enquiryType === 'business' ? 'business' : 'contact',
          name: String(form.get('name') ?? ''),
          email: String(form.get('email') ?? ''),
          message: message,
          fields: { 
            'Enquiry type': enquiryType,
            'phone': fullPhone 
          },
        })
        if (!res.ok) {
          const rawErr = res.error || ''
          const cleanErr = (rawErr.includes('Server Components render') || rawErr.includes('digest'))
            ? 'Failed to send message. Please try again or email us directly.'
            : (rawErr || 'Failed to send message. Please try again.')
          setErrorMessage(cleanErr)
          return
        }
        setSubmitted(true)
      } catch (err: any) {
        setErrorMessage('Failed to send message. Please try again or email us directly.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg border border-border bg-secondary/40 p-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight">
          Thanks — we&apos;ll be in touch.
        </h3>
        <p className="text-muted-foreground">
          A member of our team will reach out within one working day to help
          with your enquiry.
        </p>
      </div>
    )
  }

  const inputClasses =
    'mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMessage && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3.5 text-sm font-medium text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-foreground">
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
          <label htmlFor="email" className="text-sm font-medium text-foreground">
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

      <div>
        <label htmlFor="phone" className="text-sm font-medium text-foreground">
          Phone number
        </label>
        <div className="flex gap-2 items-center">
          <select
            name="phoneExtension"
            className="mt-1.5 w-[110px] shrink-0 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent cursor-pointer"
            defaultValue="+91"
          >
            <option value="+91">+91 (IN)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+1">+1 (US)</option>
            <option value="+61">+61 (AU)</option>
            <option value="+971">+971 (AE)</option>
            <option value="+65">+65 (SG)</option>
            <option value="+33">+33 (FR)</option>
            <option value="+49">+49 (DE)</option>
          </select>
          <input
            id="phone"
            name="phoneNumberOnly"
            type="tel"
            required
            pattern="^[0-9\s\-]{6,14}$"
            title="Please enter your phone number (digits only)"
            className={cn(inputClasses, "flex-1")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="enquiryType" className="text-sm font-medium text-foreground">
          I&apos;m reaching out as
        </label>
        <select id="enquiryType" name="enquiryType" className={inputClasses}>
          <option value="individual">An individual learner</option>
          <option value="business">A business or employer</option>
          <option value="press">Press or media</option>
          <option value="partnership">A potential partner</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium flex justify-between items-center text-foreground">
          <span>How can we help? <span className="text-xs text-muted-foreground font-normal">(Optional)</span></span>
          <span className={cn("text-xs font-normal", wordCount > 200 ? "text-destructive font-semibold" : "text-muted-foreground")}>
            {wordCount}/200 words
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us a little about your enquiry…"
          className={cn(inputClasses, wordCount > 200 && "border-destructive focus:border-destructive focus:ring-destructive/20")}
        />
        {wordCount > 200 && (
          <p className="mt-1 text-xs text-destructive">Message must be 200 words or less.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || wordCount > 200}
        className="inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-all hover:brightness-105 disabled:opacity-60 sm:w-auto"
      >
        {isPending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
