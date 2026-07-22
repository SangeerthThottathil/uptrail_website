import { CollectionEditor } from '@/components/admin/collection-editor'
import { getStats } from '@/lib/store/store'
import { saveStats } from '@/app/admin/actions/content'
import type { Stat } from '@/lib/store/types'

export const dynamic = 'force-dynamic'

export default async function StatsPage() {
  const stats = await getStats()

  return (
    <CollectionEditor<Stat>
      title="Impact stats"
      description="Headline numbers shown across the marketing site."
      initial={stats}
      titleKey="label"
      template={{ value: '', label: '' }}
      onSave={saveStats}
      columns={[
        { key: 'value', label: 'Value', placeholder: '92%' },
        { key: 'label', label: 'Label', placeholder: 'Hired within 6 months' },
      ]}
    />
  )
}
