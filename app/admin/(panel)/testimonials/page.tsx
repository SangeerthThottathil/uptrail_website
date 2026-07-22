import { getTestimonials } from '@/lib/store/store'
import { saveTestimonials } from '@/app/admin/actions/content'
import { CollectionEditor } from '@/components/admin/collection-editor'
import type { Testimonial } from '@/lib/store/types'

export default async function TestimonialsPage() {
  const items = await getTestimonials()

  return (
    <CollectionEditor<Testimonial>
      title="Testimonials"
      description="Written learner learner testimonials shown across the site."
      initial={items}
      titleKey="name"
      template={{ quote: '', name: '', role: '', programme: '', rating: 5, isFeatured: false, featuredTitle: '', image: '', iframeUrl: '' }}
      columns={[
        { key: 'quote', label: 'Quote (leave empty if iframe is used)', type: 'textarea', placeholder: 'What the learner said.' },
        { key: 'name', label: 'Name', placeholder: 'Amara Okafor' },
        { key: 'role', label: 'Role', placeholder: 'Data Analyst, Tesco Bank' },
        { key: 'programme', label: 'Programme', placeholder: 'Data Analytics' },
        { key: 'rating', label: 'Rating (1–5)', type: 'number', placeholder: '5' },
        { key: 'image', label: 'Profile Photo', type: 'upload', accept: 'image/*', placeholder: '/images/learner.png' },
        { key: 'isFeatured', label: 'Featured on Homepage', type: 'boolean' },
        { key: 'featuredTitle', label: 'Featured Headline (e.g., How X went from Y to Z)', placeholder: 'How Maya went from barista to data analyst.' },
        { key: 'iframeUrl', label: 'Iframe Embed URL (e.g. YouTube embed link or trustpilot, etc. - optional)', placeholder: 'https://www.youtube.com/embed/...' },
      ]}
      onSave={saveTestimonials}
    />
  )
}
