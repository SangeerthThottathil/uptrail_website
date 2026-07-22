'use client'

import { useState, useTransition, useEffect, Fragment } from 'react'
import { Trash2, Mail, MailOpen, ChevronDown, ChevronUp, Archive, RotateCcw, Loader2, Phone, Copy, Check } from 'lucide-react'
import {
  markSubmissionRead,
  fetchContactSubmissionsPaged,
  archiveContactSubmissionsAction,
  deleteContactSubmissionsAction,
} from '@/app/admin/actions/content'
import type { ContactSource, ContactSubmission } from '@/lib/store/types'
import { SelectInput, Badge, AdminButton } from '@/components/admin/ui'
import { cn } from '@/lib/utils'

const SOURCE_LABELS: Record<ContactSource, string> = {
  contact: 'Contact',
  consultation: 'Consultation',
  business: 'Business',
}

const PAGE_SIZE = 100

function getPhoneFromFields(fields: Record<string, string>): string | undefined {
  if (!fields) return undefined
  const keys = Object.keys(fields)
  const phoneKey = keys.find(
    (k) =>
      k.toLowerCase() === 'phone' ||
      k.toLowerCase() === 'phone number' ||
      k.toLowerCase() === 'telephone' ||
      k.toLowerCase() === 'mobile'
  )
  return phoneKey ? fields[phoneKey] : undefined
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer select-none inline-flex items-center justify-center shrink-0"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="size-3.5 text-green-600 stroke-[3]" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  )
}


function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy}`
}

export function SubmissionsList({
  initialData,
  sourceFilter,
}: {
  initialData: { items: ContactSubmission[]; totalCount: number }
  sourceFilter?: ContactSource
}) {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
  const [filter, setFilter] = useState<'all' | ContactSource>(sourceFilter || 'all')
  const [page, setPage] = useState(1)

  const [items, setItems] = useState<ContactSubmission[]>(initialData.items)
  const [totalCount, setTotalCount] = useState(initialData.totalCount)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  // Fetch data whenever page or tab changes
  useEffect(() => {
    // Skip first render since we initialized with server data
    if (page === 1 && activeTab === 'active' && items === initialData.items) {
      return
    }
    loadData()
  }, [page, activeTab])

  async function loadData() {
    setLoading(true)
    setSelectedIds([])
    try {
      const res = await fetchContactSubmissionsPaged(page, PAGE_SIZE, activeTab === 'archived', sourceFilter)
      setItems(res.items)
      setTotalCount(res.totalCount)
    } catch (err) {
      console.error('Failed to load submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered =
    filter === 'all'
      ? items
      : items.filter((s) => s.source === filter)

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  // Handle direct row toggle click
  const handleRowClick = (e: React.MouseEvent, id: string) => {
    const target = e.target as HTMLElement
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('a') ||
      target.closest('button')
    ) {
      return
    }
    toggleExpandRow(id)
  }

  function handleSelectRow(id: string, checked: boolean) {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((x) => x !== id))
    }
  }

  function toggleExpandRow(id: string) {
    if (expandedIds.includes(id)) {
      setExpandedIds((prev) => prev.filter((x) => x !== id))
    } else {
      setExpandedIds((prev) => [...prev, id])
    }
  }

  // Individual read toggle
  function toggleRead(id: string, currentRead: boolean) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: !currentRead } : item)))
    startTransition(() => markSubmissionRead(id, !currentRead))
  }

  function handleBulkArchive() {
    if (selectedIds.length === 0) return
    startTransition(async () => {
      setLoading(true)
      try {
        await archiveContactSubmissionsAction(selectedIds, true)
        await loadData()
      } catch (err) {
        console.error('Bulk archive failed:', err)
      } finally {
        setLoading(false)
      }
    })
  }

  function handleBulkRestore() {
    if (selectedIds.length === 0) return
    startTransition(async () => {
      setLoading(true)
      try {
        await archiveContactSubmissionsAction(selectedIds, false)
        await loadData()
      } catch (err) {
        console.error('Bulk restore failed:', err)
      } finally {
        setLoading(false)
      }
    })
  }

  function handleBulkDelete() {
    if (selectedIds.length === 0) return
    if (!confirm(`Permanently delete ${selectedIds.length} submission(s)? This action cannot be undone.`)) return
    startTransition(async () => {
      setLoading(true)
      try {
        await deleteContactSubmissionsAction(selectedIds)
        await loadData()
      } catch (err) {
        console.error('Bulk delete failed:', err)
      } finally {
        setLoading(false)
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs and filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('active')
              setPage(1)
            }}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer",
              activeTab === 'active'
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            Active Submissions
          </button>
          <button
            onClick={() => {
              setActiveTab('archived')
              setPage(1)
            }}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer",
              activeTab === 'archived'
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            Archive
          </button>
        </div>

        {!sourceFilter && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground shrink-0">Filter Source</span>
            <div className="w-48">
              <SelectInput
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | ContactSource)}
              >
                <option value="all">All sources</option>
                <option value="contact">Contact form</option>
                <option value="consultation">Consultation</option>
                <option value="business">Business enquiry</option>
              </SelectInput>
            </div>
          </div>
        )}
      </div>

      {/* Notion-style table */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {(loading || isPending) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <Loader2 className="size-8 animate-spin text-accent" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-4 w-12 text-center select-none">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filtered.map((x) => x.id))
                      } else {
                        setSelectedIds([])
                      }
                    }}
                    className="rounded border-border text-accent focus:ring-accent size-4 cursor-pointer"
                  />
                </th>
                <th className="p-4 font-semibold">Name</th>
                {!sourceFilter && <th className="p-4 font-semibold">Source</th>}
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold text-center w-24">Date</th>
                <th className="p-4 font-semibold text-center w-48">Read Status</th>
                <th className="p-4 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={sourceFilter ? 6 : 7} className="p-10 text-center text-sm text-muted-foreground">
                    No submissions to show.
                  </td>
                </tr>
              ) : (
                filtered.map((msg) => {
                  const isSelected = selectedIds.includes(msg.id)
                  const isExpanded = expandedIds.includes(msg.id)
                  const phone = getPhoneFromFields(msg.fields)

                  return (
                    <Fragment key={msg.id}>
                      <tr
                        className={cn(
                          "transition-colors hover:bg-muted/10 group cursor-pointer",
                          isSelected && "bg-accent/5 hover:bg-accent/10"
                        )}
                        onClick={(e) => handleRowClick(e, msg.id)}
                      >
                        <td
                          className="p-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(msg.id, e.target.checked)}
                            className="rounded border-border text-accent focus:ring-accent size-4 cursor-pointer"
                          />
                        </td>
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex items-center gap-1.5">
                            <span>{msg.name}</span>
                            <CopyButton text={msg.name} />
                          </div>
                        </td>
                        {!sourceFilter && (
                          <td className="p-4 text-sm text-muted-foreground">
                            <Badge tone="accent">{SOURCE_LABELS[msg.source] || msg.source}</Badge>
                          </td>
                        )}
                        <td className="p-4 text-sm text-muted-foreground">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <span>{msg.email}</span>
                              <CopyButton text={msg.email} />
                            </div>
                            {phone && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                                <span>{phone}</span>
                                <CopyButton text={phone} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground text-center">
                          {formatDate(msg.createdAt)}
                        </td>
                        <td
                          className="p-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-3">
                            <Badge tone={msg.read ? 'neutral' : 'warn'}>
                              {msg.read ? 'Read' : 'New'}
                            </Badge>
                            <button
                              type="button"
                              disabled={isPending || loading}
                              onClick={() => toggleRead(msg.id, msg.read)}
                              className="text-xs text-accent hover:underline cursor-pointer font-medium"
                            >
                              {msg.read ? 'Mark unread' : 'Mark read'}
                            </button>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {isExpanded ? (
                            <ChevronUp className="size-4 text-muted-foreground animate-none" />
                          ) : (
                            <ChevronDown className="size-4 text-muted-foreground animate-none" />
                          )}
                        </td>
                      </tr>

                      {/* Detail row */}
                      {isExpanded && (
                        <tr className="bg-muted/10">
                          <td colSpan={sourceFilter ? 6 : 7} className="p-6 border-t border-b border-border">
                            <div className="grid gap-4 md:grid-cols-2">
                              {/* Left side details */}
                              <div className="flex flex-col gap-3">
                                <div className="rounded-lg border border-border bg-background p-4">
                                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Contact Details
                                  </p>
                                  <div className="flex flex-col gap-2 text-sm">
                                    <a
                                      href={`mailto:${msg.email}`}
                                      className="inline-flex items-center gap-2 text-accent hover:underline select-all font-medium"
                                    >
                                      <Mail className="size-4 text-muted-foreground" />
                                      {msg.email}
                                    </a>
                                    {phone ? (
                                      <a
                                        href={`tel:${phone}`}
                                        className="inline-flex items-center gap-2 text-accent hover:underline select-all font-medium"
                                      >
                                        <Phone className="size-4 text-muted-foreground" />
                                        {phone}
                                      </a>
                                    ) : null}
                                  </div>
                                </div>

                                {Object.keys(msg.fields || {}).length > 0 && (
                                  <div className="rounded-lg border border-border bg-background p-4 select-text">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                      Form Fields
                                    </p>
                                    <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                                      {Object.entries(msg.fields).map(([key, value]) => (
                                        <div key={key} className="flex flex-col">
                                          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            {key}
                                          </dt>
                                          <dd className="text-foreground">{value}</dd>
                                        </div>
                                      ))}
                                    </dl>
                                  </div>
                                )}
                              </div>

                              {/* Right side message & actions */}
                              <div className="flex flex-col gap-3">
                                {msg.message && (
                                  <DetailBlock label="Message" value={msg.message} />
                                )}

                                <div className="rounded-lg border border-border bg-background p-4 flex flex-col gap-3">
                                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    Actions
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    <AdminButton
                                      variant="outline"
                                      disabled={isPending || loading}
                                      onClick={() => toggleRead(msg.id, msg.read)}
                                    >
                                      {msg.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
                                      {msg.read ? 'Mark unread' : 'Mark read'}
                                    </AdminButton>

                                    {activeTab === 'active' ? (
                                      <AdminButton
                                        variant="outline"
                                        disabled={isPending || loading}
                                        onClick={() => {
                                          startTransition(async () => {
                                            setLoading(true)
                                            try {
                                              await archiveContactSubmissionsAction([msg.id], true)
                                              await loadData()
                                            } catch (err) {
                                              console.error(err)
                                            } finally {
                                              setLoading(false)
                                            }
                                          })
                                        }}
                                      >
                                        <Archive className="size-4" />
                                        Archive Submission
                                      </AdminButton>
                                    ) : (
                                      <>
                                        <AdminButton
                                          variant="outline"
                                          disabled={isPending || loading}
                                          onClick={() => {
                                            startTransition(async () => {
                                              setLoading(true)
                                              try {
                                                await archiveContactSubmissionsAction([msg.id], false)
                                                await loadData()
                                              } catch (err) {
                                                console.error(err)
                                              } finally {
                                                setLoading(false)
                                              }
                                            })
                                          }}
                                        >
                                          <RotateCcw className="size-4" />
                                          Restore to Active
                                        </AdminButton>

                                        <AdminButton
                                          variant="danger"
                                          disabled={isPending || loading}
                                          onClick={() => {
                                            if (!confirm('Permanently delete this submission? This action cannot be undone.')) return
                                            startTransition(async () => {
                                              setLoading(true)
                                              try {
                                                await deleteContactSubmissionsAction([msg.id])
                                                await loadData()
                                              } catch (err) {
                                                console.error(err)
                                              } finally {
                                                setLoading(false)
                                              }
                                            })
                                          }}
                                        >
                                          <Trash2 className="size-4" />
                                          Delete Permanently
                                        </AdminButton>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating bulk actions bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full border border-border bg-foreground text-background px-6 py-3.5 shadow-xl animate-fade-up">
          <span className="text-sm font-medium select-none">{selectedIds.length} selected</span>
          <div className="h-4 w-px bg-background/20" />
          <div className="flex gap-2">
            {activeTab === 'active' ? (
              <button
                onClick={handleBulkArchive}
                className="flex items-center gap-1.5 rounded-lg bg-background/15 hover:bg-background/25 px-4 py-2 text-xs font-medium text-background transition-all cursor-pointer"
              >
                <Archive className="size-3.5" />
                Archive Selected
              </button>
            ) : (
              <>
                <button
                  onClick={handleBulkRestore}
                  className="flex items-center gap-1.5 rounded-lg bg-background/15 hover:bg-background/25 px-4 py-2 text-xs font-medium text-background transition-all cursor-pointer"
                >
                  <RotateCcw className="size-3.5" />
                  Restore Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 text-xs font-medium transition-all cursor-pointer"
                >
                  <Trash2 className="size-3.5" />
                  Delete Permanently
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">
            Showing Page {page} of {totalPages} ({totalCount} total)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:pointer-events-none disabled:opacity-50 transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary disabled:pointer-events-none disabled:opacity-50 transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4 select-text">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">{value}</p>
    </div>
  )
}
