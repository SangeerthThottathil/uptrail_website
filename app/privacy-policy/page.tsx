import type { Metadata } from 'next'
import { Container } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { getSettings } from '@/lib/store/store'
import { sanitizeHtml } from '@/lib/sanitize'

export const metadata: Metadata = {
  title: 'Privacy Policy | Uptrail',
  description: 'How Uptrail collects, uses and protects your personal data.',
}

export default async function PrivacyPolicyPage() {
  const settings = await getSettings()
  const rawContentHtml =
    settings?.general?.privacy_policy_content ||
    '<p>Privacy policy content is not set yet. Please configure it in the admin settings.</p>'
  const contentHtml = sanitizeHtml(rawContentHtml)

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label="Legal Policy"
        title="Privacy Notice"
        description="This privacy notice tells you what to expect us to do with your personal information. We respect your privacy and are committed to protecting your personal data."
      />

      <Container className="py-16 sm:py-20">
        <div className="max-w-3xl">
          {/* Main Legal Content */}
          <article 
            className="prose prose-base lg:prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-semibold prose-a:text-accent prose-strong:text-foreground prose-ol:list-decimal prose-ul:list-disc select-text"
            dangerouslySetInnerHTML={{ __html: contentHtml }} 
          />
        </div>
      </Container>
    </main>
  )
}
