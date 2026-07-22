'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { AlertCircle } from 'lucide-react'
import { login, type LoginState } from '@/app/admin/actions/auth'
import { Field, TextInput } from '@/components/admin/ui'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-all hover:brightness-105 disabled:opacity-60"
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}

export function LoginForm({ from }: { from: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {})

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="from" value={from} />
      <Field label="Email" htmlFor="email">
        <TextInput
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <TextInput
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </Field>

      <div className="rounded-md bg-muted px-3 py-2.5 text-xs text-muted-foreground">
        Secure authentication via **Supabase Auth**. Make sure to register an admin user in your Supabase project under **Authentication &rarr; Users** before signing in.
      </div>

      {state.error ? (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {state.error}
        </div>
      ) : null}

      <SubmitButton />
    </form>
  )
}
