'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ArrowLeft, GripVertical } from 'lucide-react'
import Link from 'next/link'
import type { Programme } from '@/lib/store/types'
import type { TrackSegment } from '@/lib/store/tracks'
import { TRACKS } from '@/lib/store/tracks'
import { saveProgramme, removeProgramme } from '@/app/admin/actions/content'
import {
  AdminPageHeader,
  Card,
  Field,
  TextInput,
  TextArea,
  SelectInput,
  AdminButton,
  UploadInput,
  Toggle,
} from '@/components/admin/ui'
import { IconPicker } from '@/components/admin/icon-picker'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function emptyProgramme(track: Programme['track']): Programme {
  return {
    slug: '',
    title: '',
    category: 'Data',
    track,
    duration: '',
    format: '',
    level: 'Beginner friendly',
    blurb: '',
    skills: [],
    outcomes: '',
    salary: '',
    image: '',
    modules: [],
    aboutRole: '',
    salaryLadder: [],
    certifications: [],
    faqs: [],
    seoTitle: '',
    metaDescription: '',
  }
}

export function ProgrammeEditor({
  segment,
  initial,
  featuredCount = 0,
}: {
  segment: TrackSegment
  initial?: Programme
  featuredCount?: number
}) {
  const meta = TRACKS[segment]
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isNew = !initial
  const originalSlug = initial?.slug
  const [data, setData] = useState<Programme>(() => {
    if (!initial) return emptyProgramme(meta.track)
    return {
      ...emptyProgramme(meta.track),
      ...initial,
      skills: initial.skills || [],
      modules: initial.modules || [],
      salaryLadder: initial.salaryLadder || [],
      certifications: initial.certifications || [],
      faqs: initial.faqs || [],
      seoTitle: initial.seoTitle || '',
      metaDescription: initial.metaDescription || '',
    }
  })
  const [autoSlug, setAutoSlug] = useState(isNew)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const initialFeatured = initial?.showInMenu || false
  const featuredOtherCount = initialFeatured ? Math.max(0, featuredCount - 1) : featuredCount

  function set<K extends keyof Programme>(key: K, value: Programme[K]) {
    setData((d) => ({ ...d, [key]: value }))
  }

  function save() {
    setErrorMsg(null)
    const payload: Programme = {
      ...data,
      track: meta.track,
      slug: data.slug || slugify(data.title),
      skills: data.skills.filter(Boolean),
    }
    if (!payload.title || !payload.slug) return
    startTransition(async () => {
      try {
        await saveProgramme(payload, originalSlug)
        router.push(`/admin/programmes/${segment}`)
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to save programme')
      }
    })
  }

  function del() {
    if (!originalSlug) return
    if (!confirm('Delete this programme? This cannot be undone.')) return
    setErrorMsg(null)
    startTransition(async () => {
      try {
        await removeProgramme(originalSlug)
        router.push(`/admin/programmes/${segment}`)
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to delete programme')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href={`/admin/programmes/${segment}`}
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="size-4" />
          Back to {meta.label}
        </Link>

        <AdminPageHeader
          title={isNew ? `New ${meta.singular}` : data.title || meta.singular}
          description={`Editing a ${meta.singular.toLowerCase()}. Fields shown are tailored to this programme type.`}
          action={
            <>
              {!isNew ? (
                <AdminButton variant="danger" onClick={del} disabled={isPending}>
                  <Trash2 className="size-4" />
                  Delete
                </AdminButton>
              ) : null}
              <AdminButton onClick={save} disabled={isPending}>
                {isPending ? 'Saving…' : 'Save programme'}
              </AdminButton>
            </>
          }
        />
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium">
          {errorMsg}
        </div>
      ) : null}

      {/* Basics */}
      <Card className="flex flex-col gap-5">
        <h2 className="font-semibold text-foreground">Basics</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title" htmlFor="title">
            <TextInput
              id="title"
              value={data.title}
              onChange={(e) => {
                const v = e.target.value
                set('title', v)
                if (autoSlug) set('slug', slugify(v))
              }}
              placeholder="AI Data Analyst Career Programme"
            />
          </Field>
          <Field label="Slug (URL)" htmlFor="slug" hint="Used in the page URL.">
            <TextInput
              id="slug"
              value={data.slug}
              onChange={(e) => {
                setAutoSlug(false)
                set('slug', slugify(e.target.value))
              }}
              placeholder="ai-data-analyst-career-programme"
            />
          </Field>
          <Field label="Category" htmlFor="category">
            <SelectInput
              id="category"
              value={data.category}
              onChange={(e) =>
                set('category', e.target.value as Programme['category'])
              }
            >
              <option value="Data">Data</option>
              <option value="Business">Business</option>
              <option value="Digital">Digital</option>
            </SelectInput>
          </Field>
          <Field label="Level" htmlFor="level">
            <TextInput
              id="level"
              value={data.level}
              onChange={(e) => set('level', e.target.value)}
              placeholder="Beginner friendly"
            />
          </Field>
          <Field label="Duration" htmlFor="duration">
            <TextInput
              id="duration"
              value={data.duration}
              onChange={(e) => set('duration', e.target.value)}
              placeholder="6 months"
            />
          </Field>
          <Field label="Format" htmlFor="format">
            <TextInput
              id="format"
              value={data.format}
              onChange={(e) => set('format', e.target.value)}
              placeholder="100% online, part-time"
            />
          </Field>
        </div>
        <Field label="Short blurb" htmlFor="blurb">
          <TextArea
            id="blurb"
            rows={3}
            value={data.blurb}
            onChange={(e) => set('blurb', e.target.value)}
            placeholder="One or two sentences summarising the programme."
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Outcomes line" htmlFor="outcomes">
            <TextInput
              id="outcomes"
              value={data.outcomes}
              onChange={(e) => set('outcomes', e.target.value)}
              placeholder="Job guarantee within 8 months or your full fee back"
            />
          </Field>
          <Field label="Highlight line" htmlFor="salary">
            <TextInput
              id="salary"
              value={data.salary}
              onChange={(e) => set('salary', e.target.value)}
              placeholder="3 globally recognised certifications"
            />
          </Field>
        </div>
        <Field label="Image" htmlFor="image" hint="Choose a file to upload or enter a custom path/URL.">
          <UploadInput
            value={data.image}
            onChange={(val) => set('image', val)}
            placeholder="/images/programmes/ai-data-analyst.png"
            accept="image/*"
          />
        </Field>
        <Field label="About the role" htmlFor="aboutRole">
          <TextArea
            id="aboutRole"
            rows={4}
            value={data.aboutRole ?? ''}
            onChange={(e) => set('aboutRole', e.target.value)}
            placeholder="Why this career matters and where it can lead."
          />
        </Field>
        <div className="border-t border-border pt-5 mt-2">
          <div className="flex flex-col gap-2">
            <Toggle
              label="Show in navigation menu"
              checked={data.showInMenu || false}
              onChange={(val) => {
                if (val && featuredOtherCount >= 3) {
                  setErrorMsg(
                    `Maximum of 3 featured programmes allowed in this category. Turn one off before adding another.`
                  )
                  return
                }
                setErrorMsg(null)
                set('showInMenu', val)
              }}
            />
            <p className="text-xs text-muted-foreground">
              {initialFeatured && data.showInMenu
                ? `This program is featured (${featuredOtherCount + 1}/3 slots used in this category).`
                : `${featuredOtherCount}/3 slots currently used in this category.`}
            </p>
          </div>
        </div>
      </Card>

      {/* SEO Settings */}
      <Card className="flex flex-col gap-5">
        <h2 className="font-semibold text-foreground">SEO Settings</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="SEO Title (optional)" htmlFor="seoTitle" hint="Custom title tag for search engines. Defaults to the programme title if empty.">
            <TextInput
              id="seoTitle"
              value={data.seoTitle || ''}
              onChange={(e) => set('seoTitle', e.target.value)}
              placeholder="Best AI Data Analyst Career Course | Uptrail"
            />
          </Field>
          <Field label="Meta Description (optional)" htmlFor="metaDescription" hint="Custom meta description for search engine results. Defaults to the blurb if empty.">
            <TextArea
              id="metaDescription"
              rows={3}
              value={data.metaDescription || ''}
              onChange={(e) => set('metaDescription', e.target.value)}
              placeholder="Master data analysis with Python, SQL, and Excel in 6 months with 1-on-1 mentor support."
            />
          </Field>
        </div>
      </Card>

      {/* Download Brochure Settings */}
      <Card className="flex flex-col gap-5">
        <h2 className="font-semibold text-foreground">Download Brochure Settings</h2>
        <div className="flex flex-col gap-4">
          <Toggle
            label="Enable Download Brochure button for this programme"
            checked={!!data.brochureEnabled}
            onChange={(val) => set('brochureEnabled', val)}
          />
          {data.brochureEnabled && (
            <Field label="Brochure Redirect / Download Link" htmlFor="brochureUrl" hint="Direct PDF link or URL to redirect users when they click Download Brochure.">
              <TextInput
                id="brochureUrl"
                value={data.brochureUrl || ''}
                onChange={(e) => set('brochureUrl', e.target.value)}
                placeholder="https://example.com/brochures/ai-data-analyst.pdf"
              />
            </Field>
          )}
        </div>
      </Card>

      {/* Skills */}
      <Card className="flex flex-col gap-4">
        <StringListEditor
          title="Skills"
          items={data.skills}
          onChange={(items) => set('skills', items)}
          placeholder="e.g. Python"
        />
      </Card>

      {/* Price — career only */}
      {meta.hasPrice ? (
        <Card className="flex flex-col gap-5">
          <h2 className="font-semibold text-foreground">Pricing</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Amount" htmlFor="price-amount">
              <TextInput
                id="price-amount"
                value={data.price?.amount ?? ''}
                onChange={(e) =>
                  set('price', { ...data.price, amount: e.target.value })
                }
                placeholder="£2,495"
              />
            </Field>
            <Field label="Original price" htmlFor="price-original">
              <TextInput
                id="price-original"
                value={data.price?.original ?? ''}
                onChange={(e) =>
                  set('price', {
                    ...data.price,
                    amount: data.price?.amount ?? '',
                    original: e.target.value,
                  })
                }
                placeholder="£2,775"
              />
            </Field>
            <Field label="Saving label" htmlFor="price-save">
              <TextInput
                id="price-save"
                value={data.price?.save ?? ''}
                onChange={(e) =>
                  set('price', {
                    ...data.price,
                    amount: data.price?.amount ?? '',
                    save: e.target.value,
                  })
                }
                placeholder="Save 10% — £280"
              />
            </Field>
            <Field label="Payment plan" htmlFor="price-plan">
              <TextInput
                id="price-plan"
                value={data.price?.plan ?? ''}
                onChange={(e) =>
                  set('price', {
                    ...data.price,
                    amount: data.price?.amount ?? '',
                    plan: e.target.value,
                  })
                }
                placeholder="£350 first payment, then 5 x £429"
              />
            </Field>
          </div>
        </Card>
      ) : null}

      {/* Salary ladder */}
      <Card className="flex flex-col gap-4">
        <ObjectListEditor
          title="Salary ladder"
          items={data.salaryLadder ?? []}
          onChange={(items) => set('salaryLadder', items)}
          template={{ role: '', range: '' }}
          fields={[
            { key: 'role', label: 'Role', placeholder: 'Data Analyst' },
            { key: 'range', label: 'Range', placeholder: '£50k – £60k' },
          ]}
        />
      </Card>

      {/* Certifications — career + certification */}
      {meta.hasCertifications ? (
        <Card className="flex flex-col gap-4">
          <ObjectListEditor
            title="Certifications"
            items={data.certifications ?? []}
            onChange={(items) => set('certifications', items)}
            template={{ name: '', detail: '', logoUrl: '' }}
            fields={[
              { key: 'name', label: 'Name', placeholder: 'CompTIA Data+' },
              {
                key: 'detail',
                label: 'Detail',
                placeholder: 'What this certification proves.',
                textarea: true,
              },
              {
                key: 'logoUrl',
                label: 'Certification Logo',
                placeholder: 'URL or upload image',
                imageUpload: true,
              },
            ]}
          />
        </Card>
      ) : null}

      {/* Modules */}
      <Card className="flex flex-col gap-4">
        <ModulesEditor
          modules={data.modules}
          onChange={(items) => set('modules', items)}
          withTakeaways={meta.hasModuleTakeaways}
        />
      </Card>

      {/* FAQs */}
      <Card className="flex flex-col gap-4">
        <ObjectListEditor
          title="FAQs"
          items={data.faqs ?? []}
          onChange={(items) => set('faqs', items)}
          template={{ q: '', a: '' }}
          fields={[
            { key: 'q', label: 'Question', placeholder: 'Do I need experience?' },
            { key: 'a', label: 'Answer', placeholder: 'The answer.', textarea: true },
          ]}
        />
      </Card>

      {/* Choose How to Pay */}
      <Card className="flex flex-col gap-4">
        <PaymentOptionsEditor
          options={data.paymentOptions ?? []}
          onChange={(items) => set('paymentOptions', items)}
        />
      </Card>
    </div>
  )
}

/* --------------------------- Sub-editors ------------------------------- */

function StringListEditor({
  title,
  items,
  onChange,
  placeholder,
}: {
  title: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <AdminButton
          variant="outline"
          onClick={() => onChange([...items, ''])}
          className="px-3 py-1.5 text-xs"
        >
          <Plus className="size-3.5" />
          Add
        </AdminButton>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing added yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <TextInput
                value={item}
                placeholder={placeholder}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = e.target.value
                  onChange(next)
                }}
              />
              <button
                suppressHydrationWarning
                type="button"
                aria-label="Remove"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

type FieldDef<T> = {
  key: keyof T
  label: string
  placeholder?: string
  textarea?: boolean
  imageUpload?: boolean
}

function ObjectListEditor<T extends Record<string, string>>({
  title,
  items,
  onChange,
  template,
  fields,
}: {
  title: string
  items: T[]
  onChange: (items: T[]) => void
  template: T
  fields: FieldDef<T>[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <AdminButton
          variant="outline"
          onClick={() => onChange([...items, { ...template }])}
          className="px-3 py-1.5 text-xs"
        >
          <Plus className="size-3.5" />
          Add
        </AdminButton>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing added yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <span className="label-mono text-muted-foreground">
                  #{i + 1}
                </span>
                <button
                  suppressHydrationWarning
                  type="button"
                  aria-label="Remove"
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              {fields.map((f) => (
                <Field key={String(f.key)} label={f.label}>
                  {f.textarea ? (
                    <TextArea
                      rows={2}
                      value={item[f.key] || ''}
                      placeholder={f.placeholder}
                      onChange={(e) => {
                        const next = [...items]
                        next[i] = { ...item, [f.key]: e.target.value }
                        onChange(next)
                      }}
                    />
                  ) : f.imageUpload ? (
                    <UploadInput
                      value={item[f.key] || ''}
                      placeholder={f.placeholder}
                      onChange={(val) => {
                        const next = [...items]
                        next[i] = { ...item, [f.key]: val }
                        onChange(next)
                      }}
                    />
                  ) : (
                    <TextInput
                      value={item[f.key] || ''}
                      placeholder={f.placeholder}
                      onChange={(e) => {
                        const next = [...items]
                        next[i] = { ...item, [f.key]: e.target.value }
                        onChange(next)
                      }}
                    />
                  )}
                </Field>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

type ModuleItem = Programme['modules'][number]

function ModulesEditor({
  modules,
  onChange,
  withTakeaways,
}: {
  modules: ModuleItem[]
  onChange: (items: ModuleItem[]) => void
  withTakeaways: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Modules</h2>
          <p className="text-xs text-muted-foreground">
            {withTakeaways
              ? 'Each module can list detailed takeaways.'
              : 'Title and a short detail per module.'}
          </p>
        </div>
        <AdminButton
          variant="outline"
          onClick={() =>
            onChange([...modules, { title: '', detail: '', takeaways: [] }])
          }
          className="px-3 py-1.5 text-xs"
        >
          <Plus className="size-3.5" />
          Add module
        </AdminButton>
      </div>
      {modules.length === 0 ? (
        <p className="text-sm text-muted-foreground">No modules yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {modules.map((m, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 rounded-lg border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 label-mono text-muted-foreground">
                  <GripVertical className="size-3.5" />
                  Module {i + 1}
                </span>
                <button
                  suppressHydrationWarning
                  type="button"
                  aria-label="Remove module"
                  onClick={() => onChange(modules.filter((_, idx) => idx !== i))}
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <Field label="Title">
                <TextInput
                  value={m.title}
                  placeholder="Data fundamentals & Excel"
                  onChange={(e) => {
                    const next = [...modules]
                    next[i] = { ...m, title: e.target.value }
                    onChange(next)
                  }}
                />
              </Field>
              <Field label="Detail">
                <TextArea
                  rows={2}
                  value={m.detail}
                  placeholder="Short description of what this module covers."
                  onChange={(e) => {
                    const next = [...modules]
                    next[i] = { ...m, detail: e.target.value }
                    onChange(next)
                  }}
                />
              </Field>
              {withTakeaways ? (
                <StringListEditor
                  title="Takeaways"
                  items={m.takeaways ?? []}
                  placeholder="What the learner will be able to do."
                  onChange={(items) => {
                    const next = [...modules]
                    next[i] = { ...m, takeaways: items }
                    onChange(next)
                  }}
                />
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function PaymentOptionsEditor({
  options = [],
  onChange,
}: {
  options: any[]
  onChange: (options: any[]) => void
}) {
  const template = {
    pillText: '',
    title: '',
    description: '',
    bulletPoints: [],
    buttonLabel: '',
    icon: 'Wallet',
    redirectUrl: '',
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Choose How to Pay Configuration</h2>
        <AdminButton
          variant="outline"
          onClick={() => onChange([...options, { ...template }])}
          className="px-3 py-1.5 text-xs"
        >
          <Plus className="size-3.5" />
          Add card
        </AdminButton>
      </div>
      {options.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payment cards configured yet.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {options.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4"
            >
              <div className="flex items-center justify-between">
                <span className="label-mono text-muted-foreground">
                  Card #{i + 1}
                </span>
                <button
                  suppressHydrationWarning
                  type="button"
                  aria-label="Remove card"
                  onClick={() => onChange(options.filter((_, idx) => idx !== i))}
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Toggle
                    label="Highlight this option"
                    checked={!!item.isHighlighted}
                    onChange={(checked) => {
                      const next = options.map((opt, idx) => {
                        if (idx === i) {
                          return { ...opt, isHighlighted: checked }
                        }
                        if (checked) {
                          return { ...opt, isHighlighted: false }
                        }
                        return opt
                      })
                      onChange(next)
                    }}
                  />
                </div>

                <Field label="Icon (Material Symbols)">
                  <IconPicker
                    value={item.icon || 'payments'}
                    onChange={(iconName) => {
                      const next = [...options]
                      next[i] = { ...item, icon: iconName }
                      onChange(next)
                    }}
                  />
                </Field>

                <Field label="Pill/badge text (e.g. SAVE 10%)">
                  <TextInput
                    value={item.pillText || ''}
                    placeholder="SAVE 10%"
                    onChange={(e) => {
                      const next = [...options]
                      next[i] = { ...item, pillText: e.target.value }
                      onChange(next)
                    }}
                  />
                </Field>

                <Field label="Title (e.g. Pay in Full)">
                  <TextInput
                    value={item.title || ''}
                    placeholder="Pay in Full"
                    onChange={(e) => {
                      const next = [...options]
                      next[i] = { ...item, title: e.target.value }
                      onChange(next)
                    }}
                  />
                </Field>

                <Field label="Description text" className="sm:col-span-2">
                  <TextArea
                    rows={2}
                    value={item.description || ''}
                    placeholder="Pay upfront before your cohort starts..."
                    onChange={(e) => {
                      const next = [...options]
                      next[i] = { ...item, description: e.target.value }
                      onChange(next)
                    }}
                  />
                </Field>

                <div className="sm:col-span-2 border-t border-border/50 pt-3">
                  <StringListEditor
                    title="Checklist bullet points"
                    items={item.bulletPoints || []}
                    onChange={(bullets) => {
                      const next = [...options]
                      next[i] = { ...item, bulletPoints: bullets }
                      onChange(next)
                    }}
                    placeholder="e.g. Best value overall"
                  />
                </div>

                <div className="sm:col-span-2 border-t border-border/50 pt-3">
                  <Field label="Button label (e.g. Pay Now)">
                    <TextInput
                      value={item.buttonLabel || ''}
                      placeholder="Pay now"
                      onChange={(e) => {
                        const next = [...options]
                        next[i] = { ...item, buttonLabel: e.target.value }
                        onChange(next)
                      }}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2 border-t border-border/50 pt-3">
                  <Field label="Custom redirection URL (optional)">
                    <TextInput
                      value={item.redirectUrl || ''}
                      placeholder="https://example.com/checkout-upfront"
                      onChange={(e) => {
                        const next = [...options]
                        next[i] = { ...item, redirectUrl: e.target.value }
                        onChange(next)
                      }}
                    />
                  </Field>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
