'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function VideoLightbox({
  isOpen,
  onClose,
  embedHtml,
}: {
  isOpen: boolean
  onClose: () => void
  embedHtml: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen || !mounted) return null

  // Injects autoplay & allow="autoplay"
  let cleanHtml = embedHtml
  try {
    if (cleanHtml.includes('<iframe')) {
      const srcRegex = /src="([^"]+)"/
      const match = embedHtml.match(srcRegex)
      if (match && match[1]) {
        let src = match[1]
        if (src.includes('?')) {
          src += '&autoplay=1&mute=0'
        } else {
          src += '?autoplay=1&mute=0'
        }
        cleanHtml = embedHtml.replace(srcRegex, `src="${src}"`)
        if (!cleanHtml.includes('allow=')) {
          cleanHtml = cleanHtml.replace('<iframe', '<iframe allow="autoplay"')
        } else if (!cleanHtml.includes('autoplay')) {
          cleanHtml = cleanHtml.replace('allow="', 'allow="autoplay; ')
        }
      }
    } else if (cleanHtml.includes('<video')) {
      if (!cleanHtml.includes('autoplay')) {
        cleanHtml = cleanHtml.replace('<video', '<video autoplay')
      }
    }
  } catch (err) {
    console.error('Failed to inject autoplay:', err)
  }

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 sm:p-10 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl aspect-video rounded-2xl bg-black overflow-hidden shadow-2xl border border-white/10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 flex size-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/75 hover:scale-105 transition-all cursor-pointer"
          aria-label="Close video"
        >
          <X className="size-5" />
        </button>

        {/* Video Embed */}
        <div
          className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full select-text pointer-events-auto"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      </div>
    </div>,
    document.body
  )
}
