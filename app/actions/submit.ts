'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import DOMPurify from 'isomorphic-dompurify'
import * as store from '@/lib/store/store'
import { getProgramme } from '@/lib/store/store'
import type { ContactSource, Track } from '@/lib/store/types'

// Simple in-memory IP rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

async function enforceRateLimit(limit: number = 15, windowMs: number = 60000) {
  let ip = 'unknown-ip'
  try {
    const reqHeaders = await headers()
    ip =
      reqHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      reqHeaders.get('x-real-ip') ||
      reqHeaders.get('cf-connecting-ip') ||
      'unknown-ip'
  } catch {
    // If headers() is unavailable or throws, fallback to unknown-ip
  }

  // If IP cannot be determined, set a higher limit to prevent locking out all users on shared proxies
  const effectiveLimit = ip === 'unknown-ip' ? 60 : limit
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return
  }

  if (entry.count >= effectiveLimit) {
    throw new Error('Too many request attempts. Please wait a minute before trying again.')
  }

  entry.count += 1
}

function sanitizeText(input: string, maxLength: number = 1000): string {
  if (!input) return ''
  const clean = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
  return clean.slice(0, maxLength).trim()
}

function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validateRedirectUrl(url: string): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  if (trimmed.startsWith('/')) return trimmed
  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString()
    }
  } catch {}
  return undefined
}

/** Programme application (career / certification / bootcamp). */
export async function submitApplication(input: {
  programmeSlug: string
  name: string
  email: string
  phone?: string
  message?: string
  paymentPlan?: string
}) {
  try {
    await enforceRateLimit()

    const name = sanitizeText(input.name, 100)
    const email = sanitizeText(input.email, 254)
    const phone = sanitizeText(input.phone ?? '', 30)
    const message = sanitizeText(input.message ?? '', 2000)
    const paymentPlan = sanitizeText(input.paymentPlan ?? '', 100)
    const programmeSlug = sanitizeText(input.programmeSlug, 100)

    if (!name || !email || !programmeSlug) {
      return { ok: false, error: 'Name, email, and programme selection are required.' }
    }

    if (!validateEmail(email)) {
      return { ok: false, error: 'Please enter a valid email address.' }
    }

    const programme = await getProgramme(programmeSlug)
    const track: Track = programme?.track ?? 'career'

    await store.addApplication({
      track,
      programmeSlug,
      programmeTitle: programme?.title ?? programmeSlug,
      name,
      email,
      phone,
      message,
      paymentPlan,
    })

    // Check for plan-specific custom redirection URL first
    const options = programme?.paymentOptions || []
    const selectedOption = options.find((opt) => opt.title === paymentPlan)
    let redirectUrl: string | undefined = undefined

    if (selectedOption && selectedOption.redirectUrl && selectedOption.redirectUrl.trim()) {
      redirectUrl = validateRedirectUrl(selectedOption.redirectUrl)
    } else {
      // Fall back to global redirect configuration
      const settings = await store.getSettings()
      if (settings.general.applicationRedirectEnabled && settings.general.applicationRedirectUrl) {
        redirectUrl = validateRedirectUrl(settings.general.applicationRedirectUrl)
      }
    }

    try {
      revalidatePath('/admin', 'layout')
    } catch {}

    return { ok: true, redirectUrl }
  } catch (err: any) {
    console.error('Error submitting application:', err)
    return { ok: false, error: err?.message || 'Failed to submit application. Please try again.' }
  }
}

/** Contact / consultation / business enquiry — a separate system. */
export async function submitContact(input: {
  source: ContactSource
  name: string
  email: string
  message?: string
  fields?: Record<string, string>
}) {
  try {
    await enforceRateLimit()

    const name = sanitizeText(input.name, 100)
    const email = sanitizeText(input.email, 254)
    const message = sanitizeText(input.message ?? '', 2000)
    
    if (!name || !email) {
      return { ok: false, error: 'Name and email are required.' }
    }

    if (!validateEmail(email)) {
      return { ok: false, error: 'Please enter a valid email address.' }
    }

    const sanitizedFields: Record<string, string> = {}
    if (input.fields) {
      for (const [k, v] of Object.entries(input.fields)) {
        const cleanKey = sanitizeText(k, 50)
        if (cleanKey) {
          sanitizedFields[cleanKey] = sanitizeText(v ?? '', 500)
        }
      }
    }

    await store.addContactSubmission({
      source: input.source,
      name,
      email,
      message,
      fields: sanitizedFields,
    })

    try {
      revalidatePath('/admin', 'layout')
    } catch {}

    return { ok: true }
  } catch (err: any) {
    console.error('Error submitting contact form:', err)
    return { ok: false, error: err?.message || 'Failed to submit enquiry. Please try again.' }
  }
}

/** Hire talent enquiry from employers. */
export async function submitHireTalent(input: {
  name: string
  company: string
  email: string
  numberOfHires?: string
  rolesHiringFor?: string
  message?: string
}) {
  try {
    await enforceRateLimit()

    const name = sanitizeText(input.name, 100)
    const company = sanitizeText(input.company, 150)
    const email = sanitizeText(input.email, 254)
    const numberOfHires = sanitizeText(input.numberOfHires ?? '', 50)
    const rolesHiringFor = sanitizeText(input.rolesHiringFor ?? '', 300)
    const message = sanitizeText(input.message ?? '', 2000)

    if (!name || !email || !company) {
      return { ok: false, error: 'Name, email, and company are required.' }
    }

    if (!validateEmail(email)) {
      return { ok: false, error: 'Please enter a valid email address.' }
    }

    await store.addHireTalentSubmission({
      name,
      company,
      email,
      numberOfHires,
      rolesHiringFor,
      message,
    })

    try {
      revalidatePath('/admin', 'layout')
    } catch {}

    return { ok: true }
  } catch (err: any) {
    console.error('Error submitting hire talent enquiry:', err)
    return { ok: false, error: err?.message || 'Failed to submit enquiry. Please try again.' }
  }
}

/** Discovery call enquiry for corporate training. */
export async function submitDiscoveryCall(input: {
  name: string
  company: string
  email: string
  teamSize?: string
  trainingArea?: string
  message?: string
}) {
  try {
    await enforceRateLimit()

    const name = sanitizeText(input.name, 100)
    const company = sanitizeText(input.company, 150)
    const email = sanitizeText(input.email, 254)
    const teamSize = sanitizeText(input.teamSize ?? '', 50)
    const trainingArea = sanitizeText(input.trainingArea ?? '', 300)
    const message = sanitizeText(input.message ?? '', 2000)

    if (!name || !email || !company) {
      return { ok: false, error: 'Name, email, and company are required.' }
    }

    if (!validateEmail(email)) {
      return { ok: false, error: 'Please enter a valid email address.' }
    }

    await store.addDiscoveryCallSubmission({
      name,
      company,
      email,
      teamSize,
      trainingArea,
      message,
    })

    try {
      revalidatePath('/admin', 'layout')
    } catch {}

    return { ok: true }
  } catch (err: any) {
    console.error('Error submitting discovery call enquiry:', err)
    return { ok: false, error: err?.message || 'Failed to submit enquiry. Please try again.' }
  }
}
