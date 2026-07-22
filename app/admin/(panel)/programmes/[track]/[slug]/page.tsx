import { notFound } from 'next/navigation'
import { getProgramme, getProgrammes } from '@/lib/store/store'
import { getTrackMeta } from '@/lib/store/tracks'
import { ProgrammeEditor } from '@/components/admin/programme-editor'

export default async function EditProgrammePage({
  params,
}: {
  params: Promise<{ track: string; slug: string }>
}) {
  const { track, slug } = await params
  const meta = getTrackMeta(track)
  if (!meta) notFound()

  const programme = await getProgramme(slug)
  if (!programme || programme.track !== meta.track) notFound()

  const allProgrammes = await getProgrammes(meta.track)
  const featuredCount = allProgrammes.filter((p) => p.showInMenu).length

  return (
    <ProgrammeEditor
      segment={meta.segment}
      initial={programme}
      featuredCount={featuredCount}
    />
  )
}
