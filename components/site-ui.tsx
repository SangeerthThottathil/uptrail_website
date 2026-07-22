import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>
      {children}
    </div>
  )
}

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'label-mono inline-flex items-center gap-2 text-muted-foreground',
        className,
      )}
    >
      <span className="inline-block size-1.5 rounded-[1px] bg-highlight" />
      {children}
    </span>
  )
}

/** Uptrail brand logo in full brand colors. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/uptrail-logo.svg"
      alt="Uptrail"
      className={cn('h-7 w-auto shrink-0', className)}
    />
  )
}

type CtaVariant = 'primary' | 'dark' | 'outline' | 'ghost'

const ctaStyles: Record<CtaVariant, string> = {
  primary:
    'bg-accent text-accent-foreground hover:brightness-105 border border-transparent',
  dark: 'bg-foreground text-background hover:bg-foreground/90 border border-transparent',
  outline:
    'bg-transparent text-foreground border border-foreground/20 hover:border-foreground/50 hover:bg-foreground/[0.03]',
  ghost:
    'bg-background text-foreground border border-border hover:bg-secondary',
}

export function CtaButton({
  href,
  children,
  variant = 'primary',
  className,
  target,
  rel,
}: {
  href: string
  children: React.ReactNode
  variant?: CtaVariant
  className?: string
  target?: string
  rel?: string
}) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-all duration-200',
        ctaStyles[variant],
        className,
      )}
    >
      {children}
    </Link>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Uptrail home"
      className={cn('inline-flex items-center', className)}
    >
      <LogoMark className="h-8" />
    </Link>
  )
}
