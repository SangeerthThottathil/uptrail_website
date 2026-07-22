'use client'

import { useState } from 'react'
import { TestimonialCard } from '@/components/testimonial-card'
import type { Testimonial } from '@/lib/data'

export function AlumniReviewsList({ reviews }: { reviews: Testimonial[] }) {
  const [visibleCount, setVisibleCount] = useState(9)

  const hasMore = reviews.length > visibleCount

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-start">
        {reviews.slice(0, visibleCount).map((t, i) => (
          <TestimonialCard key={`${t.name || 'review'}-${i}`} testimonial={t} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount(reviews.length)}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary cursor-pointer shadow-sm transition-all"
          >
            See More
          </button>
        </div>
      )}
    </div>
  )
}
