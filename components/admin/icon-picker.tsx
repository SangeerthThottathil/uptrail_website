'use client'

import { useState, useMemo } from 'react'
import { Search, X, Check } from 'lucide-react'
import rawIcons from '@/lib/material-symbols.json'

const POPULAR_PAYMENT_ICONS = [
  'payments',
  'account_balance_wallet',
  'credit_card',
  'school',
  'savings',
  'currency_pound',
  'workspace_premium',
  'verified',
  'receipt_long',
  'auto_awesome',
  'grade',
  'trending_up',
]

const allIcons: string[] = rawIcons as string[]

export function IconPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (icon: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selectedIcon = value || 'payments'

  const filteredIcons = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/\s+/g, '_')
    if (!q) return allIcons.slice(0, 72)
    return allIcons.filter((icon) => icon.toLowerCase().includes(q)).slice(0, 72)
  }, [query])

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground hover:bg-secondary/50 transition-colors"
        >
          <span className="material-symbols-outlined text-xl text-accent leading-none select-none">
            {selectedIcon}
          </span>
          <span className="font-mono text-xs text-muted-foreground">{selectedIcon}</span>
          <span className="text-xs text-accent font-medium ml-1">
            {isOpen ? 'Close' : 'Change icon'}
          </span>
        </button>
      </div>

      {isOpen && (
        <div className="z-50 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-xl max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Material Symbols (e.g. wallet, card, school)..."
              className="w-full rounded-md border border-border bg-background pl-9 pr-8 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {!query && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-muted-foreground">Popular Payment Icons</span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_PAYMENT_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => {
                      onChange(icon)
                      setIsOpen(false)
                    }}
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition-all ${
                      selectedIcon === icon
                        ? 'border-accent bg-accent/10 text-accent font-medium'
                        : 'border-border bg-background hover:bg-secondary text-foreground'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base leading-none select-none">
                      {icon}
                    </span>
                    <span>{icon}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2">
            <span>
              {query ? `Matches for "${query}"` : 'All Material Symbols'}
            </span>
            <span>{filteredIcons.length} shown</span>
          </div>

          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
            {filteredIcons.map((icon) => {
              const isSelected = selectedIcon === icon
              return (
                <button
                  key={icon}
                  type="button"
                  title={icon}
                  onClick={() => {
                    onChange(icon)
                    setIsOpen(false)
                  }}
                  className={`group relative flex size-10 items-center justify-center rounded-lg border transition-all ${
                    isSelected
                      ? 'border-accent bg-accent text-white ring-2 ring-accent/30'
                      : 'border-border bg-background hover:border-accent/50 hover:bg-accent/5 text-foreground'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl leading-none select-none">
                    {icon}
                  </span>
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent text-white ring-1 ring-background">
                      <Check className="size-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
