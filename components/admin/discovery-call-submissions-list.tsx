'use client'

import { useState, useTransition, useEffect, Fragment } from 'react'
import { Trash2, ChevronDown, Archive, RotateCcw, Loader2, Copy, Download, Check, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import {
  fetchDiscoveryCallSubmissionsPaged,
  archiveDiscoveryCallSubmissionsAction,
  deleteDiscoveryCallSubmissionsAction,
} from '@/app/admin/actions/content'
import type { DiscoveryCallSubmission } from '@/lib/store/types'
import { cn } from '@/lib/utils'

const PAGE_SIZE = 100

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

export function DiscoveryCallSubmissionsList({
  initialData,
}: {
  initialData: { items: DiscoveryCallSubmission[]; totalCount: number }
}) {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active')
  const [fromDate, setFromDate] = useState<Date | null>(null)
  const [toDate, setToDate] = useState<Date | null>(null)
  const [page, setPage] = useState(1)

  const [items, setItems] = useState<DiscoveryCallSubmission[]>(initialData.items)
  const [totalCount, setTotalCount] = useState(initialData.totalCount)

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [expandedIds, setExpandedIds] = useState<string[]>([])

  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (page === 1 && activeTab === 'active' && items === initialData.items) {
      return
    }
    loadData()
  }, [page, activeTab])

  async function loadData() {
    setLoading(true)
    setSelectedIds([])
    try {
      const res = await fetchDiscoveryCallSubmissionsPaged(page, PAGE_SIZE, activeTab === 'archived')
      setItems(res.items)
      setTotalCount(res.totalCount)
    } catch (err) {
      console.error('Failed to load discovery call submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = items.filter((s) => {
    if (!fromDate && !toDate) return true
    const date = new Date(s.createdAt)
    if (isNaN(date.getTime())) return true
    const subMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    if (fromDate) {
      const fromMidnight = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()).getTime()
      if (subMidnight < fromMidnight) return false
    }
    if (toDate) {
      const toMidnight = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate()).getTime()
      if (subMidnight > toMidnight) return false
    }
    return true
  })

  function handleExportCSV() {
    if (filtered.length === 0) return
    const headers = ['ID', 'Name', 'Company', 'Email', 'Team Size', 'Training Area', 'Message', 'Date']
    const rows = filtered.map((sub) => [
      sub.id,
      sub.name,
      sub.company,
      sub.email,
      sub.teamSize || '',
      sub.trainingArea || '',
      (sub.message || '').replace(/\n/g, ' '),
      sub.createdAt,
    ])
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
    ].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    const filename = `discovery_call_submissions_export_${new Date().toISOString().split('T')[0]}.csv`
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

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

  function handleBulkArchive() {
    if (selectedIds.length === 0) return
    startTransition(async () => {
      setLoading(true)
      try {
        await archiveDiscoveryCallSubmissionsAction(selectedIds, true)
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
        await archiveDiscoveryCallSubmissionsAction(selectedIds, false)
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
        await deleteDiscoveryCallSubmissionsAction(selectedIds)
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

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary cursor-pointer shadow-sm w-full sm:w-auto"
          >
            <Download className="size-4" />
            Export as CSV
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-muted/20 p-3 rounded-lg border border-border/50">
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
                <th className="p-4 font-semibold">Name & Company</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Team Size & Area</th>
                <th className="p-4 font-semibold">Goals / Message</th>
                <th className="p-4 font-semibold text-center w-28">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-sm text-muted-foreground">
                    No discovery call submissions to show.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const isSelected = selectedIds.includes(sub.id)
                  const isExpanded = expandedIds.includes(sub.id)

                  return (
                    <Fragment key={sub.id}>
                      <tr
                        onClick={(e) => handleRowClick(e, sub.id)}
                        className={cn(
                          "transition-colors hover:bg-muted/10 cursor-pointer group",
                          isSelected && "bg-accent/5 hover:bg-accent/10"
                        )}
                      >
                        <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(sub.id, e.target.checked)}
                            className="rounded border-border text-accent focus:ring-accent size-4 cursor-pointer"
                          />
                        </td>
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5 font-semibold">
                              <span>{sub.name}</span>
                              <CopyButton text={sub.name} />
                            </div>
                            <span className="text-xs text-muted-foreground font-normal">{sub.company}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <span>{sub.email}</span>
                            <CopyButton text={sub.email} />
                          </div>
                        </td>
                        <td className="p-4 text-sm text-foreground">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{sub.teamSize || '—'}</span>
                            <span className="text-xs text-muted-foreground">{sub.trainingArea || '—'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">
                          {sub.message || <span className="text-muted-foreground/60">—</span>}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground text-center">
                          {formatDate(sub.createdAt)}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-muted/20 border-b border-border">
                          <td colSpan={6} className="p-6">
                            <div className="rounded-lg border border-border bg-card p-5 space-y-4">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                <div>
                                  <span className="font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Full Name</span>
                                  <span className="text-foreground text-sm font-medium">{sub.name}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Company</span>
                                  <span className="text-foreground text-sm font-medium">{sub.company}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Work Email</span>
                                  <span className="text-foreground text-sm font-medium">{sub.email}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Team Size to Train</span>
                                  <span className="text-foreground text-sm font-medium">{sub.teamSize || '—'}</span>
                                </div>
                              </div>

                              <div>
                                <span className="font-semibold text-muted-foreground uppercase tracking-wider text-xs block mb-1">Training Area of Interest</span>
                                <p className="text-sm text-foreground">{sub.trainingArea || '—'}</p>
                              </div>

                              <div>
                                <span className="font-semibold text-muted-foreground uppercase tracking-wider text-xs block mb-1">Goals / Details</span>
                                <p className="text-sm text-foreground whitespace-pre-wrap bg-muted/40 p-3 rounded-md border border-border/60">{sub.message || 'No details provided.'}</p>
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
                  className="flex items-center gap-1.5 rounded-lg bg-destructive px-4 py-2 text-xs font-medium text-destructive-foreground transition-all cursor-pointer hover:brightness-110"
                >
                  <Trash2 className="size-3.5" />
                  Delete Selected
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
