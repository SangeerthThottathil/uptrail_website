import { getContactSubmissionsPaged } from '@/lib/store/store'
import { AdminPageHeader } from '@/components/admin/ui'
import { SubmissionsList } from '@/components/admin/submissions-list'

export const dynamic = 'force-dynamic'

export default async function ContactSubmissionsPage() {
  const initialData = await getContactSubmissionsPaged(1, 100, false)

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Contact submissions"
        description="Messages from the contact and business enquiry forms. Separate from programme applications."
      />
      <SubmissionsList initialData={initialData} />
    </div>
  )
}
