'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { submitApplication } from '@/app/actions/submit'
import { cn } from '@/lib/utils'
import { Search, ChevronDown, Check } from 'lucide-react'

const inputClasses =
  'mt-1.5 w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent'

const countries = [
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧', iso: 'GB' },
  { code: '+1', name: 'United States', flag: '🇺🇸', iso: 'US' },
  { code: '+91', name: 'India', flag: '🇮🇳', iso: 'IN' },
  { code: '+61', name: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '+1', name: 'Canada', flag: '🇨🇦', iso: 'CA' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿', iso: 'NZ' },
  { code: '+33', name: 'France', flag: '🇫🇷', iso: 'FR' },
  { code: '+49', name: 'Germany', flag: '🇩🇪', iso: 'DE' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪', iso: 'AE' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬', iso: 'SG' },
  { code: '+353', name: 'Ireland', flag: '🇮🇪', iso: 'IE' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦', iso: 'ZA' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱', iso: 'NL' },
  { code: '+34', name: 'Spain', flag: '🇪🇸', iso: 'ES' },
  { code: '+39', name: 'Italy', flag: '🇮🇹', iso: 'IT' },
  { code: '+81', name: 'Japan', flag: '🇯🇵', iso: 'JP' },
  { code: '+852', name: 'Hong Kong', flag: '🇭🇰', iso: 'HK' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾', iso: 'MY' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭', iso: 'CH' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪', iso: 'SE' },
  { code: '+47', name: 'Norway', flag: '🇳🇴', iso: 'NO' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰', iso: 'DK' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪', iso: 'BE' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹', iso: 'PT' },
]

export function ApplicationFormClient({
  programmeSlug,
  selectedPlan,
}: {
  programmeSlug: string
  selectedPlan: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  // Searchable Country Dropdown States
  const [selectedCountry, setSelectedCountry] = useState(countries[0]) // Default to UK (+44)
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = new FormData(e.currentTarget)
    const phoneExtension = selectedCountry.code
    const phoneNumberOnly = String(form.get('phoneNumberOnly') ?? '').trim()
    const fullPhone = `${phoneExtension} ${phoneNumberOnly}`

    startTransition(async () => {
      const res = await submitApplication({
        programmeSlug,
        name: String(form.get('name') ?? ''),
        email: String(form.get('email') ?? ''),
        phone: fullPhone,
        message: '',
        paymentPlan: selectedPlan,
      })
      if (res?.redirectUrl) {
        window.location.href = res.redirectUrl
      } else {
        router.push('/application-received')
      }
    })
  }

  const filteredCountries = searchQuery.trim()
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.includes(searchQuery) ||
          c.iso.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : countries

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        <div className="flex gap-2 items-center mt-1.5 relative">
          {/* Custom Searchable Country Selector */}
          <div ref={dropdownRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex w-[110px] items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent cursor-pointer"
            >
              <span className="truncate flex gap-1.5 items-center">
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.code}</span>
              </span>
              <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
            </button>

            {isOpen && (
              <div className="absolute left-0 mt-1.5 z-50 w-72 max-h-64 overflow-y-auto rounded-md border border-border bg-card p-2 shadow-lg flex flex-col gap-1.5">
                <div className="flex items-center gap-2 px-2 py-1.5 border-b border-border/50">
                  <Search className="size-3.5 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country..."
                    className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/70"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto max-h-48 flex flex-col gap-0.5">
                  {filteredCountries.length === 0 ? (
                    <div className="text-xs text-muted-foreground p-3 text-center">
                      No countries found
                    </div>
                  ) : (
                    filteredCountries.map((c) => {
                      const isSelected = selectedCountry.code === c.code && selectedCountry.iso === c.iso
                      return (
                        <button
                          key={`${c.iso}-${c.code}`}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c)
                            setIsOpen(false)
                            setSearchQuery('')
                          }}
                          className={cn(
                            "flex items-center justify-between w-full text-left text-xs p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors",
                            isSelected && "bg-accent/10 font-medium text-accent hover:bg-accent/15"
                          )}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span>{c.flag}</span>
                            <span className="text-muted-foreground text-[10px] uppercase font-mono">{c.iso}</span>
                            <span className="truncate text-foreground">{c.name}</span>
                          </span>
                          <span className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className="text-muted-foreground">{c.code}</span>
                            {isSelected && <Check className="size-3 text-accent shrink-0" />}
                          </span>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <input
            id="phone"
            name="phoneNumberOnly"
            type="tel"
            required
            pattern="^[0-9\s\-]{6,14}$"
            title="Please enter your phone number (digits only)"
            placeholder=""
            className={cn(inputClasses, "flex-1 !mt-0")}
          />
        </div>
      </div>

      <div className="flex items-start gap-2.5 mt-2">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          required
          className="mt-1 size-4 rounded border-border text-accent focus:ring-accent/20 cursor-pointer"
        />
        <label htmlFor="agreeToTerms" className="text-xs text-muted-foreground leading-normal cursor-pointer select-none">
          I agree to the{' '}
          <Link href="/terms-and-conditions" target="_blank" className="text-foreground font-medium underline hover:text-accent transition-colors">
            Terms &amp; Conditions
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" target="_blank" className="text-foreground font-medium underline hover:text-accent transition-colors">
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-all hover:brightness-105 disabled:opacity-60 sm:w-auto"
      >
        {isPending ? 'Proceeding…' : 'Proceed'}
      </button>
    </form>
  )
}
