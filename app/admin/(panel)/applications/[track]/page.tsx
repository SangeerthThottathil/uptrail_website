import { notFound } from 'next/navigation'
import { getApplicationsPaged } from '@/lib/store/store'
import { getTrackMeta, TRACK_SEGMENTS } from '@/lib/store/tracks'
import { AdminPageHeader } from '@/components/admin/ui'
import { ApplicationsList } from '@/components/admin/applications-list'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return TRACK_SEGMENTS.map((track) => ({ track }))
}

export default async function ApplicationsPage({
  params,
}: {
  params: Promise<{ track: string }>
}) {
  const { track } = await params
  const meta = getTrackMeta(track)
  if (!meta) notFound()

  const initialData = await getApplicationsPaged(meta.track, 1, 100, false)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title={`${meta.singular} applications`}
        description={`Applications submitted for ${meta.label.toLowerCase()}. Update status or remove entries.`}
      />
      <ApplicationsList track={meta.track} initialData={initialData} />
    </div>
  )
}
