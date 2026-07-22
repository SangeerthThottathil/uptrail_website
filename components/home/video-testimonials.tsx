'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Container, SectionLabel } from '@/components/site-ui'
import type { VideoTestimonial } from '@/lib/store/types'
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

function VideoCard({
  v,
  setActiveVideoHtml,
  isGridItem = false,
}: {
  v: VideoTestimonial
  setActiveVideoHtml: (html: string) => void
  isGridItem?: boolean
}) {
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
      onClick={() => setActiveVideoHtml(cleanHtml)}
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left transition-colors cursor-pointer group",
        isGridItem ? "w-full" : "w-[85vw] sm:w-[380px] shrink-0 snap-start"
      )}
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
        <p className="text-pretty text-base font-medium leading-snug text-foreground">
          &ldquo;{v.quote}&rdquo;
        </p>
        <div>
          <div className="text-sm font-semibold text-foreground">
            {v.name}
          </div>
          <div className="text-sm text-muted-foreground">{v.role}</div>
        </div>
        <span className="label-mono mt-1 text-[11px] text-accent">
          {v.programme}
        </span>
      </div>
    </div>
  )
}

export function VideoTestimonials({
  videoTestimonials = [],
}: {
  videoTestimonials: VideoTestimonial[]
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftState, setScrollLeftState] = useState(0)
  const [activeVideoHtml, setActiveVideoHtml] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

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

  return (
    <section className="border-t border-border bg-background">
      <Container className="py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <SectionLabel>Hear it from them</SectionLabel>
            <h2 className="mt-5 max-w-2xl text-balance text-3xl font-medium tracking-tight sm:text-4xl">
              Video stories from our graduates.
            </h2>
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              Real learners on how they switched careers, built portfolios and
              landed roles they are proud of.
            </p>
          </div>
          {/* Scroll navigation arrows (hidden when showing all in grid) */}
          {!showAll && (
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
          )}
        </div>

        {showAll ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videoTestimonials.map((v, i) => (
              <VideoCard key={`${v.name || 'video'}-${i}`} v={v} setActiveVideoHtml={setActiveVideoHtml} isGridItem={true} />
            ))}
          </div>
        ) : (
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
            {videoTestimonials.slice(0, 6).map((v, i) => (
              <VideoCard key={`${v.name || 'video'}-${i}`} v={v} setActiveVideoHtml={setActiveVideoHtml} />
            ))}
          </div>
        )}

        {/* See More Button */}
        {!showAll && videoTestimonials.length > 6 && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary cursor-pointer shadow-sm transition-all"
            >
              See More
            </button>
          </div>
        )}
      </Container>

      <VideoLightbox
        isOpen={activeVideoHtml !== null}
        onClose={() => setActiveVideoHtml(null)}
        embedHtml={activeVideoHtml || ''}
      />
    </section>
  )
}
