import { getSettings } from '@/lib/store/store'
import { SettingsEditor } from '@/components/admin/settings-editor'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const settings = await getSettings()
  return <SettingsEditor initial={settings} />
}
