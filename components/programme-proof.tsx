'use client'

import { useRef, useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Container, SectionLabel } from '@/components/site-ui'
import type { Testimonial, VideoTestimonial } from '@/lib/store/types'
import type { Programme } from '@/lib/data'
import { sanitizeEmbedCode } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { VideoLightbox } from '@/components/video-lightbox'

function getVideoThumbnail(src: string, fallbackPoster?: string) {
  if (fallbackPoster) return fallbackPoster
  const ytMatch = src.match(/(?:embed\/|watch\?v=)([a-zA-Z0-9_-]{11})/)
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`
  }
  return null
}

export function ProgrammeProof({
  programme,
  testimonials = [],
  videoTestimonials = [],
}: {
  programme: Programme
  testimonials: Testimonial[]
  videoTestimonials: VideoTestimonial[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftState, setScrollLeftState] = useState(0)
  const [activeVideoHtml, setActiveVideoHtml] = useState<string | null>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    const scrollAmount = 400
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsMouseDown(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeftState(containerRef.current.scrollLeft)
  }

  const handleMouseLeave = () => {
    setIsMouseDown(false)
  }

  const handleMouseUp = () => {
    setIsMouseDown(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    containerRef.current.scrollLeft = scrollLeftState - walk
  }

  const videos = videoTestimonials
  if (videos.length === 0) {
    return null
  }

  const matchQuotes = testimonials.filter(
    (t) => t.programme === programme.title,
  )
  const quotes = [
    ...matchQuotes,
    ...testimonials.filter((t) => t.programme !== programme.title),
  ].slice(0, 2)

  return (
    <section className="border-t border-border">
      <Container className="py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <SectionLabel>What others say</SectionLabel>
            <h2 className="mt-5 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl">
              Hear it from people who did it.
            </h2>
          </div>
          {/* Scroll navigation arrows */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary transition-all cursor-pointer"
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:bg-secondary transition-all cursor-pointer"
              aria-label="Scroll right"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={cn(
            "mt-10 flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab select-none pb-4",
            isMouseDown && "cursor-grabbing"
          )}
        >
          {videos.map((v, i) => {
            let cleanHtml = ''
            try {
              cleanHtml = sanitizeEmbedCode(v.src)
            } catch (e) {
              console.error('Failed to sanitize embed code:', e)
              if (v.src && (v.src.endsWith('.mp4') || v.src.includes('gtv-videos-bucket'))) {
                cleanHtml = `<video src="${v.src}" poster="${v.poster || ''}" controls class="w-full h-full object-cover"></video>`
              } else {
                cleanHtml = `<div class="w-full h-full bg-secondary flex items-center justify-center text-xs text-muted-foreground p-4">Invalid video content</div>`
              }
            }

            const thumbnailUrl = getVideoThumbnail(v.src, v.poster)

            return (
              <div
                key={`${v.name || 'video'}-${i}`}
                onClick={() => setActiveVideoHtml(cleanHtml)}
                className="flex w-[85vw] sm:w-[380px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-colors cursor-pointer group"
              >
                <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden border-b border-border select-none">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={v.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/20 flex items-center justify-center text-xs text-muted-foreground">
                      Click to watch story
                    </div>
                  )}
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/35 group-hover:bg-black/45 transition-colors duration-300">
                    <div className="flex size-14 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
                      <Play className="size-6 fill-current text-accent ml-0.5" />
                    </div>
                  </div>
                </div>
                <div
                  className="flex flex-col gap-2 p-5 select-text"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-pretty text-base font-medium leading-snug">
                    &ldquo;{v.quote}&rdquo;
                  </p>
                  <div>
                    <div className="text-sm font-medium">{v.name}</div>
                    <div className="text-sm text-muted-foreground">{v.role}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {quotes.map((t, i) => (
            <figure
              key={`${t.name || 'quote'}-${i}`}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/40 p-7"
            >
              <div className="flex gap-0.5 text-highlight" aria-hidden="true">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-pretty leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto">
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>

      <VideoLightbox
        isOpen={activeVideoHtml !== null}
        onClose={() => setActiveVideoHtml(null)}
        embedHtml={activeVideoHtml || ''}
      />
    </section>
  )
}
