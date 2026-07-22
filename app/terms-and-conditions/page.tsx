import type { Metadata } from 'next'
import { Container } from '@/components/site-ui'
import { PageHeader } from '@/components/page-header'
import { getSettings } from '@/lib/store/store'
import { sanitizeHtml } from '@/lib/sanitize'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Uptrail',
  description: "Uptrail's terms and conditions, including enrolment and refund policy.",
}

export default async function TermsAndConditionsPage() {
  const settings = await getSettings()
  const rawContentHtml =
    settings.general.terms_conditions_content ||
    '<p>Terms and conditions content is not set yet. Please configure it in the admin settings.</p>'
  const contentHtml = sanitizeHtml(rawContentHtml)

  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        label="Legal Policy"
        title="Terms & Conditions"
        description="These Terms and Conditions govern your purchase and use of any programme, bootcamp, short programme, career programme, module, service, or product offered by Uptrail Ltd."
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
