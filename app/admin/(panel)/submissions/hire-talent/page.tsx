import { getHireTalentSubmissionsPaged } from '@/lib/store/store'
import { AdminPageHeader } from '@/components/admin/ui'
import { HireTalentSubmissionsList } from '@/components/admin/hire-talent-submissions-list'

export const dynamic = 'force-dynamic'

export default async function HireTalentSubmissionsPage() {
  const initialData = await getHireTalentSubmissionsPaged(1, 100, false)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Hire Talent Submissions"
        description="Talent requests and employer hiring enquiries."
      />
      <HireTalentSubmissionsList initialData={initialData} />
    </div>
  )
}
