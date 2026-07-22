'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ArrowUpRight, ChevronDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LogoMark, CtaButton } from '@/components/site-ui'
import type { SiteSettings, Programme } from '@/lib/store/types'

export function SiteHeader({
  header,
  featuredProgrammes = [],
}: {
  header: SiteSettings['header']
  featuredProgrammes?: Programme[]
}) {
  const dynamicMenu = {
    careerProgrammes: featuredProgrammes
      .filter((p) => p.track === 'career')
      .map((p) => ({
        label: p.title,
        href: `/programmes/${p.slug}`,
        desc: p.blurb,
      })),
    bootcamps: featuredProgrammes
      .filter((p) => p.track === 'bootcamp')
      .map((p) => ({
        label: p.title,
        href: `/bootcamps/${p.slug}`,
        desc: p.blurb,
      })),
    certifications: featuredProgrammes
      .filter((p) => p.track === 'certification')
      .map((p) => ({
        label: p.title,
        href: `/certifications/${p.slug}`,
        desc: p.blurb,
      })),
  }

  const shownCategoriesCount =
    (dynamicMenu.careerProgrammes.length > 0 ? 1 : 0) +
    (dynamicMenu.bootcamps.length > 0 ? 1 : 0) +
    (dynamicMenu.certifications.length > 0 ? 1 : 0)

  const gridColsClass =
    shownCategoriesCount === 3
      ? 'grid-cols-4'
      : shownCategoriesCount === 2
        ? 'grid-cols-3'
        : shownCategoriesCount === 1
          ? 'grid-cols-2'
          : 'grid-cols-1'
  const { businessMenu, simpleNav, ctaLabel, ctaHref } = header
  const [open, setOpen] = useState(false)
  const [mobileSub, setMobileSub] = useState<null | 'programmes' | 'business'>(null)
  const [hovered, setHovered] = useState<null | 'prog' | 'biz'>(null)
  const pathname = usePathname()

  const triggerBase =
    'flex items-center gap-1.5 whitespace-nowrap border-r border-border px-4 text-sm transition-colors h-full'

  return (
    <header className="relative border-b border-border bg-background/90 backdrop-blur-md">
      <div className="flex h-16 items-stretch">
        {/* Logo cell */}
        <Link
          href="/"
          className="flex shrink-0 items-center border-r border-border px-5"
          aria-label="Uptrail home"
        >
          <LogoMark className="h-8" />
        </Link>

        {/* Nav cells */}
        <nav className="hidden items-stretch lg:flex">
          {/* Programmes (CSS hover group) */}
          <div
            className="group/prog flex items-stretch"
            onMouseEnter={() => setHovered('prog')}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              type="button"
              aria-haspopup="true"
              className={cn(
                triggerBase,
                'group-hover/prog:bg-secondary group-hover/prog:text-foreground',
                pathname.startsWith('/programmes') || hovered === 'prog'
                  ? 'bg-secondary text-foreground'
                  : 'text-foreground/80',
              )}
            >
              Programmes
              <ChevronDown
                className={cn(
                  'size-3.5 transition-transform group-hover/prog:rotate-180',
                  hovered === 'prog' && 'rotate-180',
                )}
              />
            </button>

            {/* Programmes mega menu */}
            <div
              className={cn(
                'invisible absolute inset-x-0 top-full border-t border-border bg-background opacity-0 shadow-lg transition-[opacity,visibility] duration-150 group-hover/prog:visible group-hover/prog:opacity-100',
                hovered === 'prog' && 'visible opacity-100',
              )}
            >
              <div className={cn("grid divide-x divide-border", gridColsClass)}>
                {dynamicMenu.careerProgrammes.length > 0 && (
                  <div className="p-8">
                    <Link
                      href="/programmes"
                      className="group/head inline-flex items-center gap-1.5 text-foreground hover:text-accent"
                    >
                      <span className="label-mono text-muted-foreground group-hover/head:text-accent">
                        Career Programmes
                      </span>
                      <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover/head:translate-x-0 group-hover/head:opacity-100" />
                    </Link>
                    <ul className="mt-5 flex flex-col gap-4">
                      {dynamicMenu.careerProgrammes.map((p) => (
                        <li key={p.href}>
                          <Link href={p.href} className="group/item flex flex-col">
                            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground group-hover/item:text-accent">
                              {p.label}
                              <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                            </span>
                            <span className="text-xs text-muted-foreground">{p.desc}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/programmes"
                      className="mt-6 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-foreground transition-colors hover:text-accent"
                    >
                      View all career programmes
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                )}

                {dynamicMenu.bootcamps.length > 0 && (
                  <div className="p-8">
                    <Link
                      href="/bootcamps"
                      className="group/head inline-flex items-center gap-1.5 text-foreground hover:text-accent"
                    >
                      <span className="label-mono text-muted-foreground group-hover/head:text-accent">
                        Bootcamps
                      </span>
                      <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover/head:translate-x-0 group-hover/head:opacity-100" />
                    </Link>
                    <ul className="mt-5 flex flex-col gap-4">
                      {dynamicMenu.bootcamps.map((p) => (
                        <li key={p.href}>
                          <Link href={p.href} className="group/item flex flex-col">
                            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground group-hover/item:text-accent">
                              {p.label}
                              <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                            </span>
                            <span className="text-xs text-muted-foreground">{p.desc}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/bootcamps"
                      className="mt-6 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-foreground transition-colors hover:text-accent"
                    >
                      View all bootcamps
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                )}

                {dynamicMenu.certifications.length > 0 && (
                  <div className="p-8">
                    <Link
                      href="/certifications"
                      className="group/head inline-flex items-center gap-1.5 text-foreground hover:text-accent"
                    >
                      <span className="label-mono text-muted-foreground group-hover/head:text-accent">
                        Certifications
                      </span>
                      <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover/head:translate-x-0 group-hover/head:opacity-100" />
                    </Link>
                    <ul className="mt-5 flex flex-col gap-4">
                      {dynamicMenu.certifications.map((p) => (
                        <li key={p.href}>
                          <Link href={p.href} className="group/item flex flex-col">
                            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground group-hover/item:text-accent">
                              {p.label}
                              <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                            </span>
                            <span className="text-xs text-muted-foreground">{p.desc}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/certifications"
                      className="mt-6 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-medium text-foreground transition-colors hover:text-accent"
                    >
                      View all certifications
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                )}

                {/* Featured card */}
                <div className="bg-secondary p-8">
                  <h4 className="label-mono text-muted-foreground">Not sure where to start?</h4>
                  <p className="mt-4 text-sm leading-relaxed text-foreground">
                    Book a free career consultation and get personalised guidance on
                    the right path for you.
                  </p>
                  <CtaButton href="/consultation" variant="primary" className="mt-5">
                    Book Consultation
                    <ArrowRight className="size-4" />
                  </CtaButton>
                </div>
              </div>
            </div>
          </div>

          {/* For Business (CSS hover group) */}
          <div
            className="group/biz flex items-stretch"
            onMouseEnter={() => setHovered('biz')}
            onMouseLeave={() => setHovered(null)}
          >
            <button
              type="button"
              aria-haspopup="true"
              className={cn(
                triggerBase,
                'group-hover/biz:bg-secondary group-hover/biz:text-foreground',
                pathname.startsWith('/business') || hovered === 'biz'
                  ? 'bg-secondary text-foreground'
                  : 'text-foreground/80',
              )}
            >
              For Business
              <ChevronDown
                className={cn(
                  'size-3.5 transition-transform group-hover/biz:rotate-180',
                  hovered === 'biz' && 'rotate-180',
                )}
              />
            </button>

            {/* For Business dropdown */}
            <div
              className={cn(
                'invisible absolute inset-x-0 top-full border-t border-border bg-background opacity-0 shadow-lg transition-[opacity,visibility] duration-150 group-hover/biz:visible group-hover/biz:opacity-100',
                hovered === 'biz' && 'visible opacity-100',
              )}
            >
              <div className="grid grid-cols-2 divide-x divide-border">
                {businessMenu.map((b) => (
                  <Link
                    key={b.href}
                    href={b.href}
                    className="group/item flex flex-col gap-2 p-8 transition-colors hover:bg-secondary"
                  >
                    <span className="flex items-center gap-1.5 text-sm font-medium text-foreground group-hover/item:text-accent">
                      {b.label}
                      <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">{b.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {simpleNav.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center whitespace-nowrap border-r border-border px-4 text-sm transition-colors',
                  active
                    ? 'bg-secondary text-foreground'
                    : 'text-foreground/80 hover:bg-secondary hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Spacer */}
        <div className="hidden flex-1 lg:block" />

        {/* Contact link */}
        <Link
          href="/contact"
          className={cn(
            'hidden items-center whitespace-nowrap border-l border-border px-5 text-sm transition-colors lg:flex',
            pathname === '/contact'
              ? 'bg-secondary text-foreground'
              : 'text-foreground/80 hover:bg-secondary hover:text-foreground',
          )}
        >
          Contact
        </Link>

        {/* Right actions */}
        <Link
          href={ctaHref}
          className="group hidden items-center gap-2 border-l border-border bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90 lg:flex"
        >
          {ctaLabel}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="ml-auto flex w-16 items-center justify-center border-l border-border text-foreground lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="flex flex-col">
            {/* Programmes accordion */}
            <button
              type="button"
              onClick={() => setMobileSub((s) => (s === 'programmes' ? null : 'programmes'))}
              className="flex items-center justify-between border-b border-border px-5 py-3.5 text-base text-foreground"
            >
              Programmes
              <ChevronDown className={cn('size-4 transition-transform', mobileSub === 'programmes' && 'rotate-180')} />
            </button>
            {mobileSub === 'programmes' && (
              <div className="flex flex-col bg-secondary">
                {dynamicMenu.careerProgrammes.length > 0 && (
                  <>
                    <Link
                      href="/programmes"
                      onClick={() => setOpen(false)}
                      className="border-b border-border bg-secondary/35 px-8 py-3 text-sm font-semibold text-foreground"
                    >
                      Career Programmes
                    </Link>
                    {dynamicMenu.careerProgrammes.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={() => setOpen(false)}
                        className="border-b border-border px-10 py-3 text-sm text-foreground/80"
                      >
                        {p.label}
                      </Link>
                    ))}
                  </>
                )}
                {dynamicMenu.bootcamps.length > 0 && (
                  <>
                    <Link
                      href="/bootcamps"
                      onClick={() => setOpen(false)}
                      className="border-b border-border bg-secondary/35 px-8 py-3 text-sm font-semibold text-foreground"
                    >
                      Bootcamps
                    </Link>
                    {dynamicMenu.bootcamps.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={() => setOpen(false)}
                        className="border-b border-border px-10 py-3 text-sm text-foreground/80"
                      >
                        {p.label}
                      </Link>
                    ))}
                  </>
                )}
                {dynamicMenu.certifications.length > 0 && (
                  <>
                    <Link
                      href="/certifications"
                      onClick={() => setOpen(false)}
                      className="border-b border-border bg-secondary/35 px-8 py-3 text-sm font-semibold text-foreground"
                    >
                      Certifications
                    </Link>
                    {dynamicMenu.certifications.map((p) => (
                      <Link
                        key={p.href}
                        href={p.href}
                        onClick={() => setOpen(false)}
                        className="border-b border-border px-10 py-3 text-sm text-foreground/80"
                      >
                        {p.label}
                      </Link>
                    ))}
                  </>
                )}
                <Link
                  href="/programmes"
                  onClick={() => setOpen(false)}
                  className="border-b border-border px-8 py-3 text-sm font-medium text-foreground"
                >
                  View all programmes
                </Link>
              </div>
            )}

            {/* Business accordion */}
            <button
              type="button"
              onClick={() => setMobileSub((s) => (s === 'business' ? null : 'business'))}
              className="flex items-center justify-between border-b border-border px-5 py-3.5 text-base text-foreground"
            >
              For Business
              <ChevronDown className={cn('size-4 transition-transform', mobileSub === 'business' && 'rotate-180')} />
            </button>
            {mobileSub === 'business' && (
              <div className="flex flex-col bg-secondary">
                {businessMenu.map((b) => (
                  <Link
                    key={b.href}
                    href={b.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-border px-8 py-3 text-sm text-foreground/80"
                  >
                    {b.label}
                  </Link>
                ))}
              </div>
            )}

            {simpleNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-border px-5 py-3.5 text-base text-foreground hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="border-b border-border px-5 py-3.5 text-base text-foreground hover:bg-secondary"
            >
              Contact
            </Link>

            <div className="flex flex-col gap-2 p-5">
              <CtaButton href="/business" variant="outline">
                For Businesses
              </CtaButton>
              <CtaButton href={ctaHref} variant="dark">
                {ctaLabel}
                <ArrowUpRight className="size-4" />
              </CtaButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
