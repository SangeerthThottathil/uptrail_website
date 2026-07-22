'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Reset window scroll position to the top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any })
  }, [pathname])

  return null
}
