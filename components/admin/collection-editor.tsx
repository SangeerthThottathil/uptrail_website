'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
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
import { RichTextEditor } from '@/components/admin/rich-text-editor'

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'upload' | 'multiselect' | 'boolean' | 'richtext'

export type ColumnDef<T> = {
  key: keyof T
  label: string
  placeholder?: string
  type?: FieldType
  full?: boolean
  accept?: string
  options?: string[]
}

function DropdownMultiselect({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string[]
  onChange: (val: string[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedLabels = options
    .map((o) => {
      const parts = o.split(':')
      return { val: parts[0], lbl: parts[1] || parts[0] }
    })
    .filter((o) => value.includes(o.val))
    .map((o) => o.lbl)

  const triggerText =
    selectedLabels.length === 0
      ? 'Select options...'
      : selectedLabels.length <= 2
      ? selectedLabels.join(', ')
      : `${selectedLabels.length} selected`

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20 cursor-pointer"
      >
        <span className="truncate">{triggerText}</span>
        <span className="ml-2 text-muted-foreground select-none">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-1.5 z-50 w-full max-h-60 overflow-y-auto rounded-md border border-border bg-card p-3 shadow-lg flex flex-col gap-2">
            {options.map((opt) => {
              const parts = opt.split(':')
              const val = parts[0]
              const lbl = parts[1] || parts[0]
              const checked = value.includes(val)

              return (
                <label
                  key={val}
                  className="flex items-center gap-2 text-sm text-foreground hover:bg-muted/30 p-1.5 rounded cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    className="rounded border-border text-accent focus:ring-accent size-4 cursor-pointer"
                    onChange={(e) => {
                      let nextList = [...value]
                      if (e.target.checked) {
                        if (!nextList.includes(val)) nextList.push(val)
                      } else {
                        nextList = nextList.filter((x) => x !== val)
                      }
                      onChange(nextList)
                    }}
                  />
                  <span>{lbl}</span>
                </label>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export function CollectionEditor<T extends Record<string, any>>({
  title,
  description,
  initial,
  columns,
  template,
  titleKey,
  onSave,
}: {
  title: string
  description?: string
  initial: T[]
  columns: ColumnDef<T>[]
  template: T
  titleKey: keyof T
  onSave: (items: T[]) => Promise<void>
}) {
  const [items, setItems] = useState<T[]>(initial)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function update(index: number, key: keyof T, val: any) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return { ...item, [key]: val }
        }
        if (val === true && (key === 'isFeatured' || key === 'showOnHome' || key === 'is_featured' || key === 'show_on_home')) {
          return { ...item, [key]: false }
        }
        return item
      }),
    )
    setSaved(false)
  }

  function add() {
    setItems((prev) => [
      {
        ...template,
        id: `temp-${Date.now()}-${Math.random()}`,
      } as any as T,
      ...prev,
    ])
    setSaved(false)
  }

  function remove(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
    setSaved(false)
  }

  function save() {
    setErrorMsg(null)
    startTransition(async () => {
      try {
        const cleaned = items.map((item) => {
          const copy = { ...item } as any
          if (copy.id && String(copy.id).startsWith('temp-')) {
            delete copy.id
          }
          return copy as T
        })
        await onSave(cleaned)
        setSaved(true)
      } catch (err: any) {
        console.error(err)
        setErrorMsg(err.message || 'An error occurred while saving.')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <AdminPageHeader
          title={title}
          description={description}
          action={
            <>
              <AdminButton variant="outline" onClick={add}>
                <Plus className="size-4" />
                Add
              </AdminButton>
              <AdminButton onClick={save} disabled={isPending}>
                {saved ? (
                  <>
                    <Check className="size-4" />
                    Saved
                  </>
                ) : isPending ? (
                  'Saving…'
                ) : (
                  'Save changes'
                )}
              </AdminButton>
            </>
          }
        />
      </div>

      {errorMsg ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive font-medium animate-none">
          {errorMsg}
        </div>
      ) : null}

      {items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No entries yet. Click &ldquo;Add&rdquo; to create one.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {items.map((item, i) => (
            <Card key={(item as any).id ?? i} className="relative flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-sm font-semibold text-foreground">
                  {String(item[titleKey]) || `New ${title.slice(0, -1)}`}
                </span>
                <AdminButton
                  variant="danger"
                  className="h-8 px-2.5 py-1 text-xs"
                  onClick={() => remove(i)}
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </AdminButton>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {columns.map((col) => (
                  <Field
                    key={String(col.key)}
                    label={col.label}
                    className={col.full ? 'sm:col-span-2' : ''}
                  >
                    {col.type === 'textarea' ? (
                      <TextArea
                        rows={3}
                        value={String(item[col.key] ?? '')}
                        placeholder={col.placeholder}
                        onChange={(e) => update(i, col.key, e.target.value)}
                      />
                    ) : col.type === 'richtext' ? (
                      <RichTextEditor
                        value={String(item[col.key] ?? '')}
                        onChange={(val) => update(i, col.key, val)}
                        placeholder={col.placeholder}
                      />
                    ) : col.type === 'upload' ? (
                      <UploadInput
                        value={String(item[col.key] ?? '')}
                        placeholder={col.placeholder}
                        accept={col.accept}
                        onChange={(val) => update(i, col.key, val)}
                      />
                    ) : col.type === 'select' ? (
                      <SelectInput
                        value={String(item[col.key] ?? '')}
                        onChange={(e) => update(i, col.key, e.target.value)}
                      >
                        {(col.options ?? []).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </SelectInput>
                    ) : col.type === 'multiselect' ? (
                      <DropdownMultiselect
                        options={col.options ?? []}
                        value={Array.isArray(item[col.key]) ? (item[col.key] as string[]) : []}
                        onChange={(nextList) => update(i, col.key, nextList)}
                      />
                    ) : col.type === 'boolean' ? (
                      <Toggle
                        checked={!!item[col.key]}
                        onChange={(val) => update(i, col.key, val)}
                        label={col.label}
                      />
                    ) : col.type === 'number' ? (
                      <TextInput
                        type="number"
                        value={String(item[col.key] ?? '')}
                        placeholder={col.placeholder}
                        onChange={(e) =>
                          update(i, col.key, Number(e.target.value))
                        }
                      />
                    ) : (
                      <TextInput
                        value={String(item[col.key] ?? '')}
                        placeholder={col.placeholder}
                        onChange={(e) => update(i, col.key, e.target.value)}
                      />
                    )}
                  </Field>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
