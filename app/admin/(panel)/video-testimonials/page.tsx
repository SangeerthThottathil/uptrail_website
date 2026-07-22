import { getVideoTestimonials, getProgrammes } from '@/lib/store/store'
import { saveVideoTestimonials } from '@/app/admin/actions/content'
import { CollectionEditor } from '@/components/admin/collection-editor'
import type { VideoTestimonial } from '@/lib/store/types'

export default async function VideoTestimonialsPage() {
  const [items, programmes] = await Promise.all([
    getVideoTestimonials(),
    getProgrammes(),
  ])

  return (
    <CollectionEditor<VideoTestimonial>
      title="Video Testimonials"
      description="Learner video stories with a poster image and a video iframe embed code."
      initial={items}
      titleKey="name"
      template={{ name: '', role: '', programme: '', quote: '', poster: '', src: '', programmeSlugs: [], showOnHome: false }}
      columns={[
        { key: 'name', label: 'Name', placeholder: 'Amara Okafor' },
        { key: 'role', label: 'Role', placeholder: 'Data Analyst, Tesco Bank' },
        { key: 'programme', label: 'Programme', placeholder: 'Data Analytics' },
        { key: 'quote', label: 'Quote', type: 'textarea', placeholder: 'Short pull quote.' },
        { key: 'poster', label: 'Poster image', type: 'upload', accept: 'image/*', placeholder: '/images/video-amara.png' },
        { key: 'src', label: 'Video Embed Code', type: 'textarea', full: true, placeholder: '<iframe src="https://www.youtube.com/embed/..." ...></iframe>' },
        {
          key: 'programmeSlugs',
          label: 'Assign to Programmes',
          type: 'multiselect',
          full: true,
          options: programmes.map((p) => `${p.slug}:${p.title}`),
        },
        { key: 'showOnHome', label: 'Show on Home Page', type: 'boolean' },
      ]}
      onSave={saveVideoTestimonials}
    />
  )
}
