import { getEmployers } from '@/lib/store/store'
import { saveEmployers } from '@/app/admin/actions/content'
import { CollectionEditor } from '@/components/admin/collection-editor'
import type { Employer } from '@/lib/store/types'

export default async function EmployersPage() {
  const items = await getEmployers()

  return (
    <CollectionEditor<Employer>
      title="Employers"
      description="Companies shown in the “where our learners work” logo strip."
      initial={items}
      titleKey="name"
      template={{ name: '', slug: '' }}
      columns={[
        { key: 'name', label: 'Company name', placeholder: 'Amazon' },
        { key: 'slug', label: 'Slug', placeholder: 'amazon' },
      ]}
      onSave={saveEmployers}
    />
  )
}
