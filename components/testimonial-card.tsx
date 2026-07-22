import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Testimonial } from '@/lib/data'
import { sanitizeEmbedCode, extractIframeDimensions } from '@/lib/utils'

export function StarRating({
  rating,
  className,
}: {
  rating: number
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            'size-4',
            i < rating
              ? 'fill-highlight text-highlight'
              : 'fill-transparent text-border',
          )}
        />
      ))}
    </div>
  )
}

export type EmbedType = 'linkedin' | 'vertical-video' | 'horizontal-video'

export function detectEmbedType(htmlOrUrl: string): EmbedType {
  const str = (htmlOrUrl || '').toLowerCase()
  if (str.includes('linkedin.com')) {
    return 'linkedin'
  }
  if (
    str.includes('instagram.com/reel') ||
    str.includes('instagram.com/p') ||
    str.includes('tiktok.com') ||
    str.includes('youtube.com/shorts') ||
    str.includes('youtube-nocookie.com/shorts')
  ) {
    return 'vertical-video'
  }
  return 'horizontal-video'
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  if (testimonial.iframeUrl) {
    const { width, height } = extractIframeDimensions(testimonial.iframeUrl)
    const w = width ? parseInt(width, 10) : NaN
    const h = height ? parseInt(height, 10) : NaN
    const hasNumericDims = !isNaN(w) && !isNaN(h)

    let cleanHtml = ''
    try {
      cleanHtml = sanitizeEmbedCode(testimonial.iframeUrl, { keepDimensions: true })
    } catch (e) {
      console.error('Failed to sanitize testimonial iframe:', e)
      cleanHtml = `<div class="p-4 text-xs text-muted-foreground bg-secondary/30 rounded-xl h-full flex items-center justify-center">Invalid iframe URL</div>`
    }

    const isLinkedIn = testimonial.iframeUrl.includes('linkedin.com')

    if (hasNumericDims) {
      if (isLinkedIn) {
        return (
          <div
            className="group w-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)] mx-auto"
            style={{
              maxWidth: `${w}px`,
            }}
          >
            <div
              className="w-full relative bg-black/5 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_iframe]:block h-[var(--iframe-height-mobile-idle)] group-hover:h-[var(--iframe-height-mobile-hover)] sm:h-[var(--iframe-height-desktop-idle)] sm:group-hover:h-[var(--iframe-height-desktop-hover)] transition-all duration-300 ease-in-out"
              style={{
                ['--iframe-height-desktop-idle' as any]: `${h - 102}px`,
                ['--iframe-height-desktop-hover' as any]: `${h - 54}px`,
                ['--iframe-height-mobile-idle' as any]: `${h - 42}px`,
                ['--iframe-height-mobile-hover' as any]: `${h + 6}px`,
              } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          </div>
        )
      }

      return (
        <div
          className="w-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)] mx-auto"
          style={{
            maxWidth: `${w}px`,
          }}
        >
          <div
            className="w-full relative bg-black/5 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_iframe]:block"
            style={{
              aspectRatio: `${w} / ${h}`,
            }}
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </div>
      )
    }

    // Fallback for non-numeric or missing dimensions
    let heightStyle = '450px'
    if (height) {
      heightStyle = height.includes('%') || height.includes('px') || height.includes('vh') ? height : `${height}px`
    } else if (isLinkedIn) {
      heightStyle = '580px'
    }

    let heightDesktopIdle = heightStyle
    let heightDesktopHover = heightStyle
    let heightMobileIdle = heightStyle
    let heightMobileHover = heightStyle

    if (isLinkedIn) {
      const parsedH = height ? parseInt(height, 10) : 580
      const baseH = isNaN(parsedH) ? 580 : parsedH
      heightDesktopIdle = `${baseH - 102}px`
      heightDesktopHover = `${baseH - 54}px`
      heightMobileIdle = `${baseH - 42}px`
      heightMobileHover = `${baseH + 6}px`
    }

    return (
      <div
        className="group w-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
        style={{
          width: '100%',
        }}
      >
        <div
          className="w-full relative bg-black/5 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_iframe]:block h-[var(--iframe-height-mobile-idle)] group-hover:h-[var(--iframe-height-mobile-hover)] sm:h-[var(--iframe-height-desktop-idle)] sm:group-hover:h-[var(--iframe-height-desktop-hover)] transition-all duration-300 ease-in-out"
          style={{
            ['--iframe-height-desktop-idle' as any]: heightDesktopIdle,
            ['--iframe-height-desktop-hover' as any]: heightDesktopHover,
            ['--iframe-height-mobile-idle' as any]: heightMobileIdle,
            ['--iframe-height-mobile-hover' as any]: heightMobileHover,
          } as React.CSSProperties}
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      </div>
    )
  }

  const initials = testimonial.name
    .split(' ')
    .map((n) => n[0])
    .join('')

  return (
    <figure className="flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]">
      <StarRating rating={testimonial.rating} />
      <blockquote className="mt-4 text-pretty text-[0.95rem] leading-relaxed text-foreground/90">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
        {testimonial.image ? (
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="size-10 rounded-full object-cover shrink-0"
          />
        ) : (
          <span className="flex size-10 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background">
            {initials}
          </span>
        )}
        <div>
          <div className="text-sm font-semibold">{testimonial.name}</div>
          <div className="text-xs text-muted-foreground">
            {testimonial.role}
          </div>
        </div>
      </figcaption>
    </figure>
  )
}
