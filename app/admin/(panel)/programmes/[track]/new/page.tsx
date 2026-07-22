import { notFound } from 'next/navigation'
import { getTrackMeta } from '@/lib/store/tracks'
import { getProgrammes } from '@/lib/store/store'
import { ProgrammeEditor } from '@/components/admin/programme-editor'

export default async function NewProgrammePage({
  params,
}: {
  params: Promise<{ track: string }>
}) {
  const { track } = await params
  const meta = getTrackMeta(track)
  if (!meta) notFound()

  const allProgrammes = await getProgrammes(meta.track)
  const featuredCount = allProgrammes.filter((p) => p.showInMenu).length

  return <ProgrammeEditor segment={meta.segment} featuredCount={featuredCount} />
}
