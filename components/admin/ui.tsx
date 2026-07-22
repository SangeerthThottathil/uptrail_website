'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadFile } from '@/app/admin/actions/content'
import { cn } from '@/lib/utils'


export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  const [titleTarget, setTitleTarget] = useState<HTMLElement | null>(null)
  const [actionsTarget, setActionsTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleTarget(document.getElementById('admin-header-title'))
      setActionsTarget(document.getElementById('admin-header-actions'))
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {titleTarget ? createPortal(title, titleTarget) : null}
      {actionsTarget && action ? createPortal(action, actionsTarget) : null}
    </>
  )
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card p-5 sm:p-6',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string
  hint?: string
  htmlFor?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

const controlClasses =
  'w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 placeholder:text-muted-foreground/70'

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input suppressHydrationWarning {...props} className={cn(controlClasses, className)} />
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea suppressHydrationWarning {...props} className={cn(controlClasses, 'resize-y', className)} />
  )
}

export function SelectInput({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select suppressHydrationWarning {...props} className={cn(controlClasses, className)}>
      {children}
    </select>
  )
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      suppressHydrationWarning
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-sm font-medium text-foreground"
    >
      <span
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-accent' : 'bg-border',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow-sm transition-transform',
            checked && 'translate-x-5',
          )}
        />
      </span>
      {label}
    </button>
  )
}

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger'

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-accent-foreground hover:brightness-105',
  outline:
    'border border-border bg-background text-foreground hover:bg-secondary',
  ghost: 'text-muted-foreground hover:bg-secondary hover:text-foreground',
  danger:
    'border border-destructive/30 bg-background text-destructive hover:bg-destructive/10',
}

export function AdminButton({
  variant = 'primary',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}) {
  return (
    <button
      suppressHydrationWarning
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-60',
        buttonStyles[variant],
        className,
      )}
    />
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'accent' | 'success' | 'warn' | 'danger'
}) {
  const tones = {
    neutral: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-emerald-500/10 text-emerald-600',
    warn: 'bg-highlight/15 text-highlight',
    danger: 'bg-destructive/10 text-destructive',
  }
  return (
    <span
      className={cn(
        'label-mono inline-flex items-center rounded-full px-2.5 py-1 text-[10px]',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, 'neutral' | 'accent' | 'success' | 'warn' | 'danger'> =
    {
      new: 'accent',
      reviewing: 'warn',
      accepted: 'success',
      rejected: 'danger',
    }
  return (
    <Badge tone={tone[status] ?? 'neutral'}>
      {status[0].toUpperCase() + status.slice(1)}
    </Badge>
  )
}

export function EmptyState({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
      <p className="font-medium text-foreground">{title}</p>
      {description ? (
        <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function UploadInput({
  value,
  onChange,
  placeholder,
  accept = 'image/*',
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  accept?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await uploadFile(formData)
      if (res.error) {
        setError(res.error)
      } else if (res.url) {
        onChange(res.url)
      } else {
        setError('Upload failed: Invalid server response')
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <TextInput
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <label className="relative flex cursor-pointer items-center justify-center rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-all shrink-0">
          {uploading ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="size-4 text-muted-foreground" />
          )}
          <span className="ml-2">{uploading ? 'Uploading…' : 'Upload'}</span>
          <input
            type="file"
            accept={accept}
            className="sr-only"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {value && (
        <div className="relative mt-1 w-fit rounded-lg border border-border p-1 bg-secondary/30">
          {accept.startsWith('image') ? (
            <img src={value} alt="Preview" className="max-h-24 w-auto rounded-md object-contain" />
          ) : accept.startsWith('video') ? (
            <video src={value} controls className="max-h-24 w-auto rounded-md" />
          ) : (
            <span className="text-xs text-muted-foreground p-1">{value}</span>
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
          >
            <X className="size-3" />
          </button>
        </div>
      )}
    </div>
  )
}

