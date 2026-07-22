'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, X } from 'lucide-react'
import type { SiteSettings } from '@/lib/store/types'

export function AnnouncementBar({
  announcement,
}: {
  announcement: SiteSettings['announcement']
}) {
  const [visible, setVisible] = useState(true)

  if (!announcement.enabled || !visible) return null

  return (
    <div className="relative bg-foreground text-background">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-10 py-2.5 text-center text-sm">
        {announcement.badge ? (
          <span className="label-mono shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground inline-block">
            {announcement.badge}
          </span>
        ) : null}
        <p className="text-pretty">{announcement.message}</p>
        {announcement.linkLabel && announcement.linkHref ? (
          <Link
            href={announcement.linkHref}
            className="link-underline group shrink-0 items-center gap-1 font-medium inline-flex"
          >
            {announcement.linkLabel}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-background/70 transition-colors hover:bg-background/10 hover:text-background"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
