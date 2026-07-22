'use client'

import { useState, useTransition, useEffect, Fragment } from 'react'
import { Trash2, Mail, Phone, ChevronDown, ChevronUp, Archive, RotateCcw, Loader2, Copy, Download, Check, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRef } from 'react'

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy}`
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

function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: {
  startDate: Date | null
  endDate: Date | null
  onChange: (start: Date | null, end: Date | null) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => {
    return startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), 1) : new Date()
  })

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7

  const daysArray: (Date | null)[] = []
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(new Date(year, month, d))
  }

  const handleDayClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      onChange(day, null)
    } else {
      if (day < startDate) {
        onChange(day, null)
      } else {
        onChange(startDate, day)
        setIsOpen(false)
      }
    }
  }

  const isSelected = (day: Date) => {
    if (!day) return false
    const dStr = day.toDateString()
    if (startDate && dStr === startDate.toDateString()) return true
    if (endDate && dStr === endDate.toDateString()) return true
    return false
  }

  const isInRange = (day: Date) => {
    if (!day || !startDate || !endDate) return false
    // compare only dates (ignoring time)
    const dTime = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime()
    const sTime = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime()
    const eTime = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime()
    return dTime > sTime && dTime < eTime
  }

  const formatButtonText = () => {
    if (!startDate) return 'SUBMISSION DATE'
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    const startStr = startDate.toLocaleDateString('en-US', options)
    if (!endDate || startDate.toDateString() === endDate.toDateString()) {
      return `${startStr}, ${startDate.getFullYear()}`
    }
    const endStr = endDate.toLocaleDateString('en-US', options)
    return `${startStr} - ${endStr}, ${endDate.getFullYear()}`
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long' })

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground hover:bg-secondary cursor-pointer shadow-sm select-none"
      >
        <Calendar className="size-4 text-muted-foreground" />
        <span>{formatButtonText()}</span>
        <ChevronDown className="size-3.5 text-muted-foreground ml-1" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-72 rounded-xl border border-border bg-card p-4 shadow-xl animate-fade-in select-none">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-sm font-bold text-foreground">
              {monthName} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground mb-1">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {daysArray.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />

              const selected = isSelected(day)
              const inRange = isInRange(day)

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-all hover:bg-accent hover:text-accent-foreground cursor-pointer relative",
                    selected && "bg-foreground text-background font-semibold hover:bg-foreground hover:text-background",
                    inRange && "bg-accent/15 text-accent hover:bg-accent/25 rounded-none"
                  )}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>

          {(startDate || endDate) && (
            <div className="mt-3 pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onChange(null, null)
                  setIsOpen(false)
                }}
                className="text-xs text-destructive hover:underline font-semibold cursor-pointer"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
import {
  changeApplicationStatus,
  fetchApplicationsPaged,
  archiveApplicationsAction,
  deleteApplicationsAction,
} from '@/app/admin/actions/content'
import type { ApplicationStatus, ProgrammeApplication, Track } from '@/lib/store/types'
import { Card, SelectInput, StatusBadge } from '@/components/admin/ui'
import { cn } from '@/lib/utils'

const STATUSES: ApplicationStatus[] = ['new', 'reviewing', 'accepted', 'rejected']
const PAGE_SIZE = 100

export function ApplicationsList({
  track,
  initialData,
}: {
  track: Track
  initialData: { items: ProgrammeApplication[]; totalCount: number }
}) {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [programmeFilter, setProgrammeFilter] = useState<string>('all')
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [page, setPage] = useState(1)
  
  const [items, setItems] = useState<ProgrammeApplication[]>(initialData.items)
  const [totalCount, setTotalCount] = useState(initialData.totalCount)

  const uniquePlans = Array.from(
    new Set(
      items
        .map((a) => a.paymentPlan)
        .filter(Boolean)
    )
  ).sort()

  const uniqueProgrammes = Array.from(
    new Set(
      items
        .map((a) => a.programmeTitle)
        .filter(Boolean)
    )
  ).sort()
  
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])
  
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  // Fetch data whenever page, tab, or track changes
  useEffect(() => {
    // Skip first render since we initialized with server data
    if (page === 1 && activeTab === 'active' && items === initialData.items) {
      return
    }
    loadData()
  }, [page, activeTab, track])

  async function loadData() {
    setLoading(true)
    setSelectedIds([])
    try {
      const res = await fetchApplicationsPaged(track, page, PAGE_SIZE, activeTab === 'archived')
      setItems(res.items)
      setTotalCount(res.totalCount)
    } catch (err) {
      console.error('Failed to load applications:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = items
    .filter((a) => planFilter === 'all' || a.paymentPlan === planFilter)
    .filter((a) => programmeFilter === 'all' || a.programmeTitle === programmeFilter)
    .filter((a) => {
      if (!fromDate && !toDate) return true
      const date = new Date(a.createdAt)
      if (isNaN(date.getTime())) return true
      
      const appMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
      
      if (fromDate) {
        const fromMidnight = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()).getTime()
        if (appMidnight < fromMidnight) return false
      }
      if (toDate) {
        const toMidnight = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()).getTime()
        if (appMidnight > toMidnight) return false
      }
      return true
    })

  function handleExportCSV() {
    if (filtered.length === 0) return
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Applied To', 'Payment Plan', 'Message', 'Date']
    const rows = filtered.map((app) => [
      app.id,
      app.name,
      app.email,
      app.phone,
      app.programmeTitle,
      app.paymentPlan || '',
      (app.message || '').replace(/\n/g, ' '),
      app.createdAt
    ])
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    const filename = `applications_${track}_export_${new Date().toISOString().split('T')[0]}.csv`
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  // Handle direct row toggle click
  const handleRowClick = (e: React.MouseEvent, id: string) => {
    // Prevent toggle when clicking on interactive elements
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

  function handleBulkArchive() {
    if (selectedIds.length === 0) return
    startTransition(async () => {
      setLoading(true)
      try {
        await archiveApplicationsAction(selectedIds, true)
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
        await archiveApplicationsAction(selectedIds, false)
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
    if (!confirm(`Permanently delete ${selectedIds.length} application(s)? This action cannot be undone.`)) return
    startTransition(async () => {
      setLoading(true)
      try {
        await deleteApplicationsAction(selectedIds)
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
      <div className="flex flex-col gap-4 border-b border-border pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              Active Applications
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

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary cursor-pointer shadow-sm w-full sm:w-auto"
          >
            <Download className="size-4" />
            Export as CSV
          </button>
        </div>

        {/* Dropdowns / Navigation Bar Style Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-muted/20 p-3 rounded-lg border border-border/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">
              Filter {track === 'career' ? 'Programme' : track === 'certification' ? 'Certification' : 'Bootcamp'}
            </span>
            <div className="w-56">
              <SelectInput
                value={programmeFilter}
                onChange={(e) => {
                  setPage(1)
                  setProgrammeFilter(e.target.value)
                }}
              >
                <option value="all">All {track === 'career' ? 'programmes' : track === 'certification' ? 'certifications' : 'bootcamps'}</option>
                {uniqueProgrammes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground shrink-0">Filter Plan</span>
            <div className="w-48">
              <SelectInput
                value={planFilter}
                onChange={(e) => {
                  setPage(1)
                  setPlanFilter(e.target.value)
                }}
              >
                <option value="all">All plans</option>
                {uniquePlans.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>

          <div className="h-4 w-px bg-border hidden lg:block" />

          {/* Custom Date Range Calendar Dropdown */}
          <div className="flex items-center gap-2">
            <DateRangePicker
              startDate={fromDate}
              endDate={toDate}
              onChange={(start, end) => {
                setPage(1)
                setFromDate(start)
                setToDate(end)
              }}
            />
          </div>
        </div>
      </div>

      {/* Notion-style table/list */}
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
                <th className="p-4 font-semibold">Applied To</th>
                <th className="p-4 font-semibold">Payment Plan</th>
                <th className="p-4 font-semibold">Contact</th>
                <th className="p-4 font-semibold text-center w-24">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-sm text-muted-foreground">
                    No applications to show.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => {
                  const isSelected = selectedIds.includes(app.id)

                  return (
                    <Fragment key={app.id}>
                      <tr
                        className={cn(
                          "transition-colors hover:bg-muted/10 group",
                          isSelected && "bg-accent/5 hover:bg-accent/10"
                        )}
                      >
                        <td
                          className="p-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(app.id, e.target.checked)}
                            className="rounded border-border text-accent focus:ring-accent size-4 cursor-pointer"
                          />
                        </td>
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex items-center gap-1.5">
                            <span>{app.name}</span>
                            <CopyButton text={app.name} />
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {app.programmeTitle}
                        </td>
                        <td className="p-4 text-sm text-foreground font-medium">
                          {app.paymentPlan || <span className="text-muted-foreground/60">—</span>}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <span>{app.email}</span>
                              <CopyButton text={app.email} />
                            </div>
                            {app.phone && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80">
                                <span>{app.phone}</span>
                                <CopyButton text={app.phone} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground text-center">
                          {formatDate(app.createdAt)}
                        </td>
                      </tr>
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
