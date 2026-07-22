import { getDiscoveryCallSubmissionsPaged } from '@/lib/store/store'
import { AdminPageHeader } from '@/components/admin/ui'
import { DiscoveryCallSubmissionsList } from '@/components/admin/discovery-call-submissions-list'

export const dynamic = 'force-dynamic'

export default async function DiscoveryCallSubmissionsPage() {
  const initialData = await getDiscoveryCallSubmissionsPaged(1, 100, false)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Book Discovery Call Submissions"
        description="Corporate training enquiries and discovery call requests."
      />
      <DiscoveryCallSubmissionsList initialData={initialData} />
    </div>
  )
}
