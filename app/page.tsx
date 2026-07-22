import { Hero } from '@/components/home/hero'
import { LogoStrip } from '@/components/home/logo-strip'
import { ProgrammesSection } from '@/components/home/programmes-section'
import { VideoTestimonials } from '@/components/home/video-testimonials'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CommunitySection } from '@/components/home/community-section'
import { EmployerSection } from '@/components/home/employer-section'
import { FinalCta } from '@/components/final-cta'

import type { Metadata } from 'next'
import { getEmployers, getProgrammes, getTestimonials, getHomeVideoTestimonials, getFeaturedSuccessStory } from '@/lib/store/store'

export const metadata: Metadata = {
  title: 'Career Programmes for Graduates & Career Switchers | Uptrail',
  description:
    'Live, mentor-led career programmes helping graduates and career switchers land data, business and digital roles. 1,500+ learners in 55+ countries. Free consultation.',
}

export default async function HomePage() {
  const [employers, programmes, testimonials, videoTestimonials, featuredSuccessStory] = await Promise.all([
    getEmployers(),
    getProgrammes(),
    getTestimonials(),
    getHomeVideoTestimonials(),
    getFeaturedSuccessStory(),
  ])

  return (
    <main>
      <Hero featuredSuccessStory={featuredSuccessStory} />
      <LogoStrip employers={employers} />
      <ProgrammesSection programmes={programmes} />
      <VideoTestimonials videoTestimonials={videoTestimonials} />
      <TestimonialsSection testimonials={testimonials} />
      <CommunitySection />
      <EmployerSection />
      <FinalCta />
    </main>
  )
}
