import Link from 'next/link'
import { Logo, Container } from '@/components/site-ui'
import { PixelFlame } from '@/components/pixel-flame'
import type { SiteSettings } from '@/lib/store/types'

const SOCIAL_LABELS: Record<keyof SiteSettings['social'], string> = {
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
}

export function SiteFooter({
  footer,
  social,
}: {
  footer: SiteSettings['footer']
  social: SiteSettings['social']
}) {
  const socialEntries = (
    Object.entries(social) as [keyof SiteSettings['social'], string][]
  ).filter(([, href]) => href)

  return (
    <footer className="border-t border-border bg-background">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {footer.description}
            </p>
            {socialEntries.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-4">
                {socialEntries.map(([key, href]) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline text-sm text-foreground/80 transition-colors hover:text-accent"
                    >
                      {SOCIAL_LABELS[key]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-6 max-w-[180px]">
              <PixelFlame rows={5} cols={18} />
            </div>
          </div>

          {footer.groups.map((group) => (
            <div key={group.title}>
              <h4 className="label-mono text-muted-foreground">
                {group.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-underline text-sm text-foreground/80 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {footer.companyLine}
          </p>
          <div className="flex items-center gap-5">
            {footer.legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="link-underline hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <span className="label-mono">{footer.note}</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
