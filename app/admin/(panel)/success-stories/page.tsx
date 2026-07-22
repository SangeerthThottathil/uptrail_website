import { getSuccessStories } from '@/lib/store/store'
import { saveSuccessStories } from '@/app/admin/actions/content'
import { CollectionEditor } from '@/components/admin/collection-editor'
import type { SuccessStory } from '@/lib/store/types'

export default async function SuccessStoriesPage() {
  const items = await getSuccessStories()

  return (
    <CollectionEditor<SuccessStory>
      title="Success Stories"
      description="Detailed narrative-based alumni transition stories shown under the Alumni Stories section."
      initial={items}
      titleKey="name"
      template={{
        name: '',
        fromRole: '',
        toRole: '',
        story: '',
        isFeatured: false,
        featuredTitle: '',
        displayOrder: 0,
      }}
      columns={[
        { key: 'name', label: 'Name', placeholder: 'Maya Thompson' },
        { key: 'fromRole', label: 'Before Uptrail (from)', placeholder: 'Barista' },
        { key: 'toRole', label: 'First role after (to)', placeholder: 'Data Analyst at Monzo' },
        { key: 'story', label: 'Alumni Narrative/Story', type: 'textarea', placeholder: 'Describe their journey and transition...' },
        { key: 'isFeatured', label: 'Featured on Homepage Hero', type: 'boolean' },
        { key: 'featuredTitle', label: 'Featured Headline (e.g., How X went from Y to Z)', placeholder: 'How Maya went from barista to data analyst.' },
      ]}
      onSave={saveSuccessStories}
    />
  )
}
