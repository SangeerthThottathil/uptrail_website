import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Plus, Pencil } from 'lucide-react'
import { getProgrammes } from '@/lib/store/store'
import { getTrackMeta, TRACK_SEGMENTS } from '@/lib/store/tracks'
import {
  AdminPageHeader,
  Card,
  AdminButton,
  Badge,
  EmptyState,
} from '@/components/admin/ui'

export function generateStaticParams() {
  return TRACK_SEGMENTS.map((track) => ({ track }))
}

export default async function ProgrammeListPage({
  params,
}: {
  params: Promise<{ track: string }>
}) {
  const { track } = await params
  const meta = getTrackMeta(track)
  if (!meta) notFound()

  const programmes = await getProgrammes(meta.track)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title={meta.label}
        description={meta.description}
        action={
          <Link href={`/admin/programmes/${meta.segment}/new`}>
            <AdminButton>
              <Plus className="size-4" />
              New {meta.singular.toLowerCase()}
            </AdminButton>
          </Link>
        }
      />

      {programmes.length === 0 ? (
        <EmptyState
          title={`No ${meta.label.toLowerCase()} yet`}
          description={`Create your first ${meta.singular.toLowerCase()} to get started.`}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {programmes.map((p) => (
            <Card key={p.slug} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-medium text-foreground">
                    {p.title}
                  </h2>
                  <Badge tone="accent">{p.category}</Badge>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {p.duration} · {p.format}
                </p>
              </div>
              <Link href={`/admin/programmes/${meta.segment}/${p.slug}`}>
                <AdminButton variant="outline" className="px-3 py-2">
                  <Pencil className="size-4" />
                  Edit
                </AdminButton>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
