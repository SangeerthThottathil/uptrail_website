import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Uptrail Reviews — What Our Learners Say',
  description:
    'Honest reviews from Uptrail learners and alumni: live mentoring, real projects, career coaching and landing their first roles in tech.',
}

export default function ReviewsPage() {
  redirect('/success-stories')
}
