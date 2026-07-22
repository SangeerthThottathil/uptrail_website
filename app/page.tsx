import { Hero } from '@/components/home/hero'
import { LogoStrip } from '@/components/home/logo-strip'
import { ProgrammesSection } from '@/components/home/programmes-section'
import { VideoTestimonials } from '@/components/home/video-testimonials'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CommunitySection } from '@/components/home/community-section'
import { EmployerSection } from '@/components/home/employer-section'
import { FinalCta } from '@/components/final-cta'

import { getEmployers, getProgrammes, getTestimonials, getHomeVideoTestimonials, getFeaturedSuccessStory } from '@/lib/store/store'

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
