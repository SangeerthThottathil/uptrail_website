'use client'

import { useState, useTransition } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { saveSettings } from '@/app/admin/actions/content'
import type { SiteSettings } from '@/lib/store/types'
import {
  AdminPageHeader,
  Card,
  Field,
  TextInput,
  TextArea,
  Toggle,
  AdminButton,
} from '@/components/admin/ui'

import { RichTextEditor } from '@/components/admin/rich-text-editor'

type TabKey = 'general' | 'legal' | 'contact' | 'announcement' | 'header' | 'footer' | 'social'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'legal', label: 'Legal Pages' },
  { key: 'contact', label: 'Contact' },
  { key: 'announcement', label: 'Announcement' },
  { key: 'header', label: 'Header' },
  { key: 'footer', label: 'Footer' },
  { key: 'social', label: 'Social' },
]

export function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState<SiteSettings>(initial)
  const [tab, setTab] = useState<TabKey>('general')
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function patch<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setS((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function save() {
    startTransition(async () => {
      await saveSettings(s)
      setSaved(true)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <AdminPageHeader
          title="Site settings"
          description="Configure global announcement banner, contact info, social links and navigation menus."
          action={
            <AdminButton onClick={save} disabled={isPending}>
              {saved ? (
                <>
                  <Check className="size-4" />
                  Saved
                </>
              ) : isPending ? (
                'Saving…'
              ) : (
                'Save settings'
              )}
            </AdminButton>
          }
        />
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={
              'rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors ' +
              (tab === t.key
                ? 'border-b-2 border-accent text-foreground'
                : 'text-muted-foreground hover:text-foreground')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'general' && (
        <div className="flex flex-col gap-6">
          <Card className="grid gap-4 sm:grid-cols-2">
            <Field label="Site name">
              <TextInput
                value={s.general.siteName}
                onChange={(e) =>
                  patch('general', { ...s.general, siteName: e.target.value })
                }
              />
            </Field>
            <Field label="Tagline">
              <TextInput
                value={s.general.tagline}
                onChange={(e) =>
                  patch('general', { ...s.general, tagline: e.target.value })
                }
              />
            </Field>
            <Field label="Description" className="sm:col-span-2">
              <TextArea
                rows={3}
                value={s.general.description}
                onChange={(e) =>
                  patch('general', { ...s.general, description: e.target.value })
                }
              />
            </Field>
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Post-Application Redirection</h3>
            <p className="text-xs text-muted-foreground">
              Configure whether to redirect candidates to a custom external/internal URL (e.g. Stripe checkout, booking calendar, custom onboarding) upon successful application submission.
            </p>
            <div className="border-t border-border pt-4">
              <Toggle
                label="Enable custom redirection"
                checked={!!s.general.applicationRedirectEnabled}
                onChange={(checked) =>
                  patch('general', { ...s.general, applicationRedirectEnabled: checked })
                }
              />
            </div>
            {s.general.applicationRedirectEnabled && (
              <Field label="Redirection URL" className="mt-2">
                <TextInput
                  placeholder="https://example.com/onboarding"
                  value={s.general.applicationRedirectUrl || ''}
                  onChange={(e) =>
                    patch('general', { ...s.general, applicationRedirectUrl: e.target.value })
                  }
                />
              </Field>
            )}
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Consultation Calendar Iframe</h3>
            <p className="text-xs text-muted-foreground">
              Embed a third-party calendar widget (like Calendly, SavvyCal, TidyCal) directly on the Book a Consultation page to allow users to book a slot directly. This replaces the backend consultation request form.
            </p>
            <div className="border-t border-border pt-4">
              <Toggle
                label="Enable calendar iframe"
                checked={!!s.general.consultationIframeEnabled}
                onChange={(checked) =>
                  patch('general', { ...s.general, consultationIframeEnabled: checked })
                }
              />
            </div>
            {s.general.consultationIframeEnabled && (
              <>
                <Field label="Calendar Iframe URL or Embed Code" className="mt-2">
                  <TextInput
                    placeholder="https://calendly.com/your-team or <iframe src='...'></iframe>"
                    value={s.general.consultationIframeUrl || ''}
                    onChange={(e) =>
                      patch('general', { ...s.general, consultationIframeUrl: e.target.value })
                    }
                  />
                </Field>

                <Field label="Booking Widget URL (Zoho/Nimbuspop Script Widget)" className="mt-2">
                  <TextInput
                    placeholder="https://uptrailltd.zohobookings.eu/portal-embed#/242257000000040052"
                    value={s.general.booking_widget_url || ''}
                    onChange={(e) =>
                      patch('general', { ...s.general, booking_widget_url: e.target.value })
                    }
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    For script-based widgets (e.g., Zoho Bookings via Nimbuspop). If configured, this loads the bookings script dynamically. Enter only the widget portal URL here.
                  </p>
                </Field>
              </>
            )}
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Download Brochure Settings</h3>
            <p className="text-xs text-muted-foreground">
              Enable or disable the Download Brochure CTA button globally across the site, and configure a custom link or file download URL for it.
            </p>
            <div className="border-t border-border pt-4">
              <Toggle
                label="Enable Download Brochure button"
                checked={!!s.general.downloadBrochureEnabled}
                onChange={(checked) =>
                  patch('general', { ...s.general, downloadBrochureEnabled: checked })
                }
              />
            </div>
            {s.general.downloadBrochureEnabled && (
              <Field label="Brochure Link / Redirect URL" className="mt-2">
                <TextInput
                  placeholder="https://example.com/uptrail-brochure.pdf"
                  value={s.general.downloadBrochureUrl || ''}
                  onChange={(e) =>
                    patch('general', { ...s.general, downloadBrochureUrl: e.target.value })
                  }
                />
              </Field>
            )}
          </Card>
        </div>
      )}

      {tab === 'legal' && (
        <div className="flex flex-col gap-6">
          <Card className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Privacy Policy</h3>
            <p className="text-xs text-muted-foreground">
              Configure the content for the Privacy Policy page (/privacy-policy). Use the rich-text toolbar to format headings, bullet lists, links, blockquotes, and text styling.
            </p>
            <RichTextEditor
              value={s.general.privacy_policy_content || ''}
              onChange={(html) =>
                patch('general', {
                  ...s.general,
                  privacy_policy_content: html,
                })
              }
            />
          </Card>

          <Card className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Terms &amp; Conditions</h3>
            <p className="text-xs text-muted-foreground">
              Configure the content for the Terms and Conditions page (/terms-and-conditions). Use the rich-text toolbar to format headings, bullet lists, links, blockquotes, and text styling.
            </p>
            <RichTextEditor
              value={s.general.terms_conditions_content || ''}
              onChange={(html) =>
                patch('general', {
                  ...s.general,
                  terms_conditions_content: html,
                })
              }
            />
          </Card>
        </div>
      )}

      {tab === 'contact' && (
        <Card className="grid gap-4 sm:grid-cols-2">
          <Field label="Email">
            <TextInput
              type="email"
              value={s.contact.email}
              onChange={(e) =>
                patch('contact', { ...s.contact, email: e.target.value })
              }
            />
          </Field>
          <Field label="Phone">
            <TextInput
              value={s.contact.phone}
              onChange={(e) =>
                patch('contact', { ...s.contact, phone: e.target.value })
              }
            />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <TextArea
              rows={2}
              value={s.contact.address}
              onChange={(e) =>
                patch('contact', { ...s.contact, address: e.target.value })
              }
            />
          </Field>
        </Card>
      )}

      {tab === 'announcement' && (
        <Card className="flex flex-col gap-4">
          <Toggle
            checked={s.announcement.enabled}
            onChange={(v) =>
              patch('announcement', { ...s.announcement, enabled: v })
            }
            label="Show announcement bar"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Pill/badge text">
              <TextInput
                value={s.announcement.badge}
                onChange={(e) =>
                  patch('announcement', {
                    ...s.announcement,
                    badge: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Message/text content">
              <TextInput
                value={s.announcement.message}
                onChange={(e) =>
                  patch('announcement', {
                    ...s.announcement,
                    message: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Button label">
              <TextInput
                value={s.announcement.linkLabel}
                onChange={(e) =>
                  patch('announcement', {
                    ...s.announcement,
                    linkLabel: e.target.value,
                  })
                }
              />
            </Field>
            <Field label="Link URL">
              <TextInput
                value={s.announcement.linkHref}
                onChange={(e) =>
                  patch('announcement', {
                    ...s.announcement,
                    linkHref: e.target.value,
                  })
                }
              />
            </Field>
          </div>
        </Card>
      )}

      {tab === 'header' && (
        <div className="flex flex-col gap-4">
          <Card className="grid gap-4 sm:grid-cols-2">
            <Field label="CTA label">
              <TextInput
                value={s.header.ctaLabel}
                onChange={(e) =>
                  patch('header', { ...s.header, ctaLabel: e.target.value })
                }
              />
            </Field>
            <Field label="CTA URL">
              <TextInput
                value={s.header.ctaHref}
                onChange={(e) =>
                  patch('header', { ...s.header, ctaHref: e.target.value })
                }
              />
            </Field>
          </Card>

          <LinkListEditor
            title="Simple nav links"
            links={s.header.simpleNav}
            onChange={(simpleNav) => patch('header', { ...s.header, simpleNav })}
          />

          <DescLinkListEditor
            title="Business menu"
            links={s.header.businessMenu}
            onChange={(businessMenu) =>
              patch('header', { ...s.header, businessMenu })
            }
          />
        </div>
      )}

      {tab === 'footer' && (
        <div className="flex flex-col gap-4">
          <Card className="grid gap-4">
            <Field label="Footer description">
              <TextArea
                rows={2}
                value={s.footer.description}
                onChange={(e) =>
                  patch('footer', { ...s.footer, description: e.target.value })
                }
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company line">
                <TextInput
                  value={s.footer.companyLine}
                  onChange={(e) =>
                    patch('footer', {
                      ...s.footer,
                      companyLine: e.target.value,
                    })
                  }
                />
              </Field>
              <Field label="Note">
                <TextInput
                  value={s.footer.note}
                  onChange={(e) =>
                    patch('footer', { ...s.footer, note: e.target.value })
                  }
                />
              </Field>
            </div>
          </Card>

          {s.footer.groups.map((group, gi) => (
            <Card key={gi} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <TextInput
                  value={group.title}
                  placeholder="Group title"
                  onChange={(e) => {
                    const groups = [...s.footer.groups]
                    groups[gi] = { ...group, title: e.target.value }
                    patch('footer', { ...s.footer, groups })
                  }}
                />
                <button
                  type="button"
                  aria-label="Remove group"
                  onClick={() => {
                    const groups = s.footer.groups.filter((_, i) => i !== gi)
                    patch('footer', { ...s.footer, groups })
                  }}
                  className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <InlineLinks
                links={group.links}
                onChange={(links) => {
                  const groups = [...s.footer.groups]
                  groups[gi] = { ...group, links }
                  patch('footer', { ...s.footer, groups })
                }}
              />
            </Card>
          ))}
          <div>
            <AdminButton
              variant="outline"
              onClick={() =>
                patch('footer', {
                  ...s.footer,
                  groups: [...s.footer.groups, { title: '', links: [] }],
                })
              }
            >
              <Plus className="size-4" />
              Add footer group
            </AdminButton>
          </div>

          <LinkListEditor
            title="Legal links"
            links={s.footer.legalLinks}
            onChange={(legalLinks) =>
              patch('footer', { ...s.footer, legalLinks })
            }
          />
        </div>
      )}

      {tab === 'social' && (
        <Card className="grid gap-4 sm:grid-cols-2">
          {(
            ['twitter', 'linkedin', 'instagram', 'youtube', 'facebook'] as const
          ).map((key) => (
            <Field key={key} label={key[0].toUpperCase() + key.slice(1)}>
              <TextInput
                value={s.social[key]}
                placeholder={`https://…`}
                onChange={(e) =>
                  patch('social', { ...s.social, [key]: e.target.value })
                }
              />
            </Field>
          ))}
        </Card>
      )}
    </div>
  )
}

type NavLink = { label: string; href: string }

function LinkListEditor({
  title,
  links,
  onChange,
}: {
  title: string
  links: NavLink[]
  onChange: (links: NavLink[]) => void
}) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <AdminButton
          variant="outline"
          onClick={() => onChange([...links, { label: '', href: '' }])}
        >
          <Plus className="size-4" />
          Add
        </AdminButton>
      </div>
      <InlineLinks links={links} onChange={onChange} />
    </Card>
  )
}

function InlineLinks({
  links,
  onChange,
}: {
  links: NavLink[]
  onChange: (links: NavLink[]) => void
}) {
  if (links.length === 0)
    return <p className="text-sm text-muted-foreground">No links yet.</p>
  return (
    <div className="flex flex-col gap-2">
      {links.map((link, i) => (
        <div key={i} className="flex items-center gap-2">
          <TextInput
            value={link.label}
            placeholder="Label"
            onChange={(e) => {
              const next = [...links]
              next[i] = { ...link, label: e.target.value }
              onChange(next)
            }}
          />
          <TextInput
            value={link.href}
            placeholder="/path"
            onChange={(e) => {
              const next = [...links]
              next[i] = { ...link, href: e.target.value }
              onChange(next)
            }}
          />
          <button
            type="button"
            aria-label="Remove link"
            onClick={() => onChange(links.filter((_, idx) => idx !== i))}
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

function DescLinkListEditor({
  title,
  links,
  onChange,
}: {
  title: string
  links: (NavLink & { desc: string })[]
  onChange: (links: (NavLink & { desc: string })[]) => void
}) {
  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <AdminButton
          variant="outline"
          onClick={() => onChange([...links, { label: '', href: '', desc: '' }])}
        >
          <Plus className="size-4" />
          Add
        </AdminButton>
      </div>
      {links.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {links.map((link, i) => (
            <div
              key={i}
              className="grid gap-2 rounded-lg border border-border p-3 sm:grid-cols-2"
            >
              <TextInput
                value={link.label}
                placeholder="Label"
                onChange={(e) => {
                  const next = [...links]
                  next[i] = { ...link, label: e.target.value }
                  onChange(next)
                }}
              />
              <div className="flex items-center gap-2">
                <TextInput
                  value={link.href}
                  placeholder="/path"
                  onChange={(e) => {
                    const next = [...links]
                    next[i] = { ...link, href: e.target.value }
                    onChange(next)
                  }}
                />
                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => onChange(links.filter((_, idx) => idx !== i))}
                  className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <TextInput
                className="sm:col-span-2"
                value={link.desc}
                placeholder="Short description"
                onChange={(e) => {
                  const next = [...links]
                  next[i] = { ...link, desc: e.target.value }
                  onChange(next)
                }}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
